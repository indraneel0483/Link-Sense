const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });

async function identifySocialLinks(links) {
  const prompt = `You are given a list of URLs extracted from a website homepage.
Your task is to identify and categorize only the social media profile links.

Return a JSON object with social platform names as keys and the URLs as values.
Only include platforms you find. If none found, return an empty object {}.

Supported platforms to look for: twitter, linkedin, facebook, instagram, youtube, tiktok, pinterest, github, reddit, snapchat, threads, whatsapp, telegram.

URLs:
${links.join('\n')}

Respond ONLY with valid JSON. No explanation, no markdown. Example:
{"twitter": "https://twitter.com/example", "linkedin": "https://linkedin.com/company/example"}`;

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  };

  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload)
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(Buffer.from(response.body).toString('utf-8'));
  const text = responseBody.content[0].text.trim();

  return JSON.parse(text);
}

module.exports = { identifySocialLinks };
