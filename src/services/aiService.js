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
const AI_MAX_TOKENS = Number(import.meta.env.VITE_AI_MAX_TOKENS || 2048);
const AI_TEMPERATURE = Number(import.meta.env.VITE_AI_TEMPERATURE || 0.7);
const AI_TOP_P = Number(import.meta.env.VITE_AI_TOP_P || 0.95);
const AI_ENABLE_THINKING = String(import.meta.env.VITE_AI_ENABLE_THINKING || '').toLowerCase() === 'true';

function isLikelyLocalBaseUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '::1';
  } catch {
    return false;
  }
}

function assertConfigured() {
  // For development, we'll use mock responses if no real API is configured
  if (!AI_API_KEY || AI_API_KEY.includes('placeholder') || AI_API_KEY.includes('test-key')) {
    console.log('Using mock AI responses for development');
    return; // Allow mock responses
  }
  
  // Ollama and other local OpenAI-compatible servers typically don't require an API key.
  if (!AI_API_KEY && !isLikelyLocalBaseUrl(AI_BASE_URL)) {
    throw new Error(
      'AI is not configured. Set VITE_AI_API_KEY (and optionally VITE_AI_BASE_URL, VITE_AI_MODEL) in your environment.'
    );
  }
}

function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (AI_API_KEY) headers.Authorization = `Bearer ${AI_API_KEY}`;
  return headers;
}

function buildHeadersForStream(isStream) {
  const headers = buildHeaders();
  headers.Accept = isStream ? 'text/event-stream' : 'application/json';
  return headers;
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
 * Generate mock AI responses for development
 */
function generateMockResponse(userMessage, opportunity) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('hi') || message.includes('hello')) {
    return `Hello! I'm here to help you with the **${opportunity.title}** opportunity at **${opportunity.organization}**. 

This looks like a great ${opportunity.type} opportunity! Based on the details, you'd be working with ${opportunity.description.split('.')[0]}. 

What would you like to know about this opportunity? I can help you:
- Understand the requirements better
- Assess your fit for the role
- Generate a cover letter
- Draft a cold email
- Provide application tips`;
  }
  
  if (message.includes('cover letter')) {
    return `I'd be happy to help you create a cover letter for the **${opportunity.title}** position!

Here's a professional draft:

---

Dear Hiring Manager,

I am writing to express my strong interest in the ${opportunity.title} position at ${opportunity.organization}. 

With my background in [Your Major], I'm particularly drawn to this opportunity because it aligns perfectly with my skills and career aspirations. The opportunity to ${opportunity.description.split('.')[0]} excites me greatly.

My qualifications include:
- [Relevant coursework or experience]
- [Technical skills relevant to the role]
- [Projects or achievements]

I am confident that my skills and enthusiasm would make me a valuable addition to your team.

Thank you for considering my application. I look forward to discussing how I can contribute to ${opportunity.organization}.

Best regards,
[Your Name]

---

Would you like me to customize this further based on your specific background?`;
  }
  
  if (message.includes('requirements') || message.includes('qualify')) {
    return `Great question about the requirements for **${opportunity.title}**! 

Here are the key requirements:
${opportunity.requirements.map(req => `  - ${req}`).join('\n')}

**Eligibility:** ${opportunity.eligibility}

To assess your fit, I'd recommend:
1. Highlighting any experience with the technologies mentioned
2. Emphasizing relevant coursework or projects
3. Showing enthusiasm for ${opportunity.organization}'s mission

Would you like me to help you identify which of your strengths align best with these requirements?`;
  }
  
  if (message.includes('deadline') || message.includes('when')) {
    return `The deadline for **${opportunity.title}** is **${opportunity.deadline}**. 

That gives you some time to prepare a strong application! Here's what I'd suggest:
- Start drafting your materials this week
- Focus on the requirements that match your background
- Reach out to any contacts at ${opportunity.organization} if possible

The position is located in **${opportunity.location}** and offers **${opportunity.stipend}**.

Is there anything specific about the timeline or application process you'd like help with?`;
  }
  
  // Default response
  return `That's a great question about the **${opportunity.title}** opportunity! 

This ${opportunity.type} at **${opportunity.organization}** looks like an excellent chance to ${opportunity.description.split('.')[0].toLowerCase()}. 

The role requires ${opportunity.requirements.length} key qualifications and is open to ${opportunity.eligibility.toLowerCase()}.

I can help you with:
- Understanding specific requirements
- Assessing your fit for the role  
- Generating application materials
- Providing interview preparation tips

What specific aspect would you like to explore further?`;
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

    // Check if we should use mock responses
    if (!AI_API_KEY || AI_API_KEY.includes('placeholder') || AI_API_KEY.includes('test-key')) {
      const lastMessage = messages[messages.length - 1];
      const mockResponse = generateMockResponse(lastMessage.content, opportunity);
      
      // Simulate streaming by yielding chunks of the mock response
      const words = mockResponse.split(' ');
      let currentText = '';
      
      for (const word of words) {
        currentText += word + ' ';
        yield word + ' ';
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      return;
    }

    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: buildHeadersForStream(true),
      body: JSON.stringify({
        model: AI_MODEL,
        messages: formattedMessages,
        max_tokens: AI_MAX_TOKENS,
        temperature: AI_TEMPERATURE,
        top_p: AI_TOP_P,
        stream: true,
        ...(AI_ENABLE_THINKING ? { chat_template_kwargs: { enable_thinking: true } } : {}),
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`AI API error: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
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
    yield `Error: ${error?.message || 'AI request failed.'}`;
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
      headers: buildHeadersForStream(false),
      body: JSON.stringify({
        model: AI_MODEL,
        messages: formattedMessages,
        max_tokens: AI_MAX_TOKENS,
        temperature: AI_TEMPERATURE,
        top_p: AI_TOP_P,
        stream: false,
        ...(AI_ENABLE_THINKING ? { chat_template_kwargs: { enable_thinking: true } } : {}),
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
  // Check if we should use mock responses
  if (!AI_API_KEY || AI_API_KEY.includes('placeholder') || AI_API_KEY.includes('test-key')) {
    console.log('Using mock tailored listing response');
    
    // Generate a mock tailored analysis
    const mockAnalysis = `## AI Advantage Report

**Why You?**
- Your ${profile.major} background aligns perfectly with this ${opportunity.type}'s focus on ${opportunity.requirements[0]?.toLowerCase() || 'technical skills'}
- Your interests in ${profile.interests.slice(0, 2).join(' and ')} directly match the key requirements for this role

**Application Strategy**
- Highlight your experience with ${opportunity.requirements[1]?.toLowerCase() || 'relevant technologies'} in your application materials
- Emphasize projects that demonstrate your ability to ${opportunity.description.split('.')[0].toLowerCase()}

**Institutional & Local Context**
- ${profile.college}'s reputation in ${profile.major} gives you a competitive edge for this position
- Being located in ${profile.county}, ${profile.state} provides unique networking opportunities with ${opportunity.organization}

This opportunity is an excellent match for your profile. Apply with confidence!`;

    return mockAnalysis;
  }

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
