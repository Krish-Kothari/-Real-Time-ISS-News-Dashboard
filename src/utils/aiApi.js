import axios from 'axios';

const HF_API_BASE = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
const HF_TOKEN = import.meta.env.VITE_AI_TOKEN;

export const aiApi = {
  // Call Hugging Face API for chat responses
  generateResponse: async (prompt, context = '') => {
    try {
      const fullPrompt = `${context}\n\nUser: ${prompt}\n\nAssistant:`;
      
      const response = await axios.post(
        HF_API_BASE,
        {
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data[0]) {
        const text = response.data[0].generated_text;
        // Extract the assistant's response
        const assistantPart = text.split('Assistant:')[1]?.trim() || text;
        return assistantPart;
      }

      return 'Unable to generate response. Please try again.';
    } catch (error) {
      console.error('Error calling Hugging Face API:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  },
};

export default aiApi;
