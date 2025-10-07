const { app } = require('@azure/functions');
const { AzureOpenAI } = require('openai');

app.http('foundry', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const endpoint = process.env.AZURE_FOUNDRY_ENDPOINT;
        const apiKey = process.env.AZURE_FOUNDRY_KEY;
        const apiVersion = process.env.AZURE_FOUNDRY_API_VERSION;
        const deployment = process.env.AZURE_FOUNDRY_MODEL;

        const temperature = 0.2;
        const max_tokens = 800;

        async function main(content) {
          const client = new AzureOpenAI({
            endpoint,
            apiKey,
            apiVersion,
            deployment,
            dangerouslyAllowBrowser: false
          });
          const result = await client.chat.completions.create({
            messages: [
              { role: "system", content: request.params.systemPrompt },
              { role: "user", content: request.params.userPrompt },
              { role: "user", content: JSON.stringify(content) },
            ],
            model: "",
            temperature: temperature,
            max_tokens: max_tokens
          });

          return (result.choices[0].message);
        }

        const response = await main(request.params.content);

        return { body: JSON.stringify({ "text": response.content }) };
    }
});
