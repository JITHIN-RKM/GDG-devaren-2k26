/**
 * AI Service — Cloud Chat API (OpenAI-compatible)
 *
 * IMPORTANT:
 * - This runs in the browser. Your API key will be exposed to clients.
 * - For production, proxy this through a backend.
 */

const AI_BASE_URL = (import.meta.env.VITE_AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || '';
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini';

function assertConfigured() {
  if (!AI_API_KEY) {
    throw new Error(
      'AI is not configured. Set VITE_AI_API_KEY (and optionally VITE_AI_BASE_URL, VITE_AI_MODEL) in your environment.'
    );
  }
}

/**
 * Build a system prompt that includes the opportunity context.
 */
function buildSystemPrompt(opportunity) {
  return `You are Altezza AI, a friendly and expert career assistant embedded in an opportunity discovery platform for students. You are currently helping a student who is viewing the following opportunity:

**${opportunity.title}** at **${opportunity.organization}**
Type: ${opportunity.type}
Deadline: ${opportunity.deadline}
Location: ${opportunity.location}
Stipend/Prize: ${opportunity.stipend}

Description: ${opportunity.fullDescription}

Requirements:
${opportunity.requirements.map(r => `- ${r}`).join('\n')}

Eligibility: ${opportunity.eligibility}

Your job is to:
1. Answer any questions about this specific opportunity accurately.
2. Help the student assess their fit for this opportunity.
3. When asked, generate professional cover letters and cold emails tailored to this opportunity.
4. Provide actionable advice on how to strengthen their application.

Be concise, encouraging, and specific. Reference details from the opportunity listing when relevant.`;
}

function toChatMessages(messages, systemPrompt) {
  return [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];
}

function extractStreamDelta(json) {
  // OpenAI-compatible: { choices: [{ delta: { content } }] }
  const choice = json?.choices?.[0];
  return choice?.delta?.content || '';
}

function extractNonStreamContent(json) {
  // OpenAI-compatible: { choices: [{ message: { content } }] }
  const choice = json?.choices?.[0];
  return choice?.message?.content || '';
}

/**
 * Send a chat message to a cloud API and get a streamed response.
 * Returns an async generator that yields text chunks.
 */
export async function* streamChat(messages, opportunity) {
  const systemPrompt = buildSystemPrompt(opportunity);

  const formattedMessages = toChatMessages(messages, systemPrompt);

  try {
    assertConfigured();

    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: formattedMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`AI API error: ${response.status} ${response.statusText}${text ? ` — ${text}` : ''}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice('data:'.length).trim();
        if (!data || data === '[DONE]') continue;

        try {
          const json = JSON.parse(data);
          const delta = extractStreamDelta(json);
          if (delta) yield delta;
        } catch {
          // ignore malformed JSON fragments
        }
      }
    }
  } catch (error) {
    yield `⚠️ ${error?.message || 'AI request failed.'}`;
  }
}

/**
 * Non-streaming chat for simpler use cases.
 */
export async function sendChat(messages, opportunity) {
  const systemPrompt = buildSystemPrompt(opportunity);

  const formattedMessages = toChatMessages(messages, systemPrompt);

  try {
    assertConfigured();

    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: formattedMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`AI API error: ${response.status}${text ? ` — ${text}` : ''}`);
    }

    const data = await response.json();
    return extractNonStreamContent(data) || 'No response received.';
  } catch (error) {
    return `⚠️ ${error?.message || 'AI request failed.'}`;
  }
}

/**
 * Generate a cover letter prompt.
 */
export function getCoverLetterPrompt(opportunity, profile) {
  return `Please generate a professional, compelling cover letter for a student applying to "${opportunity.title}" at ${opportunity.organization}. 

The student's profile:
- Major: ${profile.major || 'Not specified'}
- Interests: ${(profile.interests || []).join(', ') || 'Not specified'}
- Current Year: ${profile.year || 'Not specified'}
- CGPA: ${profile.cgpa || 'Not specified'}

Make the cover letter:
- Professional yet personable
- Highlight relevant skills and interests that match the opportunity requirements
- Show enthusiasm and genuine interest
- Keep it concise (under 400 words)
- Include proper letter formatting with [Your Name] placeholders`;
}

/**
 * Generate a cold email prompt.
 */
export function getColdEmailPrompt(opportunity, profile) {
  return `Please draft a concise, professional cold email to a relevant contact at ${opportunity.organization} regarding the "${opportunity.title}" opportunity.

The student's profile:
- Major: ${profile.major || 'Not specified'}
- Interests: ${(profile.interests || []).join(', ') || 'Not specified'}
- Current Year: ${profile.year || 'Not specified'}
- CGPA: ${profile.cgpa || 'Not specified'}

The email should:
- Have a compelling subject line
- Be concise (under 200 words)
- Show you've researched the organization
- Mention specific skills relevant to the role
- Include a clear call-to-action
- Be professional but not overly formal`;
}

/**
 * Tailor an opportunity listing for a specific user profile
 */
export async function generateTailoredListing(opportunity, profile) {
  const prompt = `
    Analyze this career opportunity and tailor it for the following student profile:
    
    Student Profile:
    - Major: ${profile.major}
    - Interests: ${profile.interests.join(', ')}
    - Academic Year: ${profile.year}
    - Location: ${profile.county}, ${profile.state || 'Local Area'}
    - College: ${profile.college}
    
    Opportunity:
    - Title: ${opportunity.title}
    - Company: ${opportunity.company}
    - Description: ${opportunity.description}
    - Requirements: ${opportunity.requirements?.join(', ')}
    
    Please provide a premium, concise "AI Advantage" report with:
    1. "Why You?" - 2 specific reasons why this student is a great fit, referencing their major (${profile.major}) and interests.
    2. "Application Strategy" - 1 actionable tip on what to highlight.
    3. "Institutional & Local Context" - Mention how their college (${profile.college}) or location (${profile.county}, ${profile.state}) provides a unique advantage for this role.
    
    Return the response as a clear, bulleted report. Use a professional, motivating tone. Keep it under 150 words.
  `;

  try {
    const content = await sendChat(
      [{ role: 'user', content: prompt }],
      // tailored analysis still benefits from opportunity context in the system prompt
      opportunity
    );
    return content;
  } catch (error) {
    console.error('AI Tailoring failed:', error);
    return null;
  }
}
