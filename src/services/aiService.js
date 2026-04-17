/**
 * AI Service — Ollama GLM 5.1 Cloud Integration
 *
 * Model: glm-5.1:cloud
 * API Key: configured below
 * Endpoint: Ollama local proxy at http://localhost:11434
 */

const OLLAMA_BASE_URL = 'http://localhost:11434';
const MODEL_NAME = 'llama3.1:8b';
const API_KEY = '4d9ab350a1814ceb9ac42acc320d62d3.bcdfZ9bmoy175JiFYzsbR65F';

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

/**
 * Send a chat message to Ollama and get a streamed response.
 * Returns an async generator that yields text chunks.
 */
export async function* streamChat(messages, opportunity) {
  const systemPrompt = buildSystemPrompt(opportunity);

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  ];

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: formattedMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message && json.message.content) {
            yield json.message.content;
          }
        } catch {
          // Skip malformed JSON lines
        }
      }
    }
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      yield `⚠️ Unable to connect to the AI service. Please make sure Ollama is running locally.\n\nRun this command to start:\n\`\`\`\nollama run glm-5.1:cloud\n\`\`\`\n\nThen try again.`;
    } else {
      yield `Error: ${error.message}`;
    }
  }
}

/**
 * Non-streaming chat for simpler use cases.
 */
export async function sendChat(messages, opportunity) {
  const systemPrompt = buildSystemPrompt(opportunity);

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  ];

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: formattedMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.message?.content || 'No response received.';
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      return '⚠️ Unable to connect to AI service. Please ensure Ollama is running with `ollama run glm-5.1:cloud`.';
    }
    return `Error: ${error.message}`;
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
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) throw new Error('Failed to reach AI service');
    
    const result = await response.json();
    return result.response;
  } catch (error) {
    console.error('AI Tailoring failed:', error);
    return null;
  }
}
