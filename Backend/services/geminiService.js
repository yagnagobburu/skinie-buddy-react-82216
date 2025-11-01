import axios from 'axios';

/**
 * Get AI response from Google Gemini API
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} - The AI generated response
 */
export const getGeminiResponse = async (prompt) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
      throw new Error('Gemini API key not configured');
    }

    // Using v1beta API with gemini-2.5-flash (latest stable model)
    // Alternative models: gemini-2.5-pro (more powerful), gemini-2.0-flash (older)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048, // Increased for longer responses
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    // Extract text from response
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }
  } catch (error) {
    console.error('❌ Gemini API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.response?.status === 401) {
      throw new Error('Invalid Gemini API key');
    } else if (error.response?.status === 403) {
      throw new Error('Gemini API access forbidden. Check your API key permissions.');
    } else {
      throw new Error('Failed to generate AI response. Please try again.');
    }
  }
};

/**
 * Generate skincare routine using Gemini AI
 * @param {Object} params - Parameters for routine generation
 * @param {Array} params.products - User's products
 * @param {string} params.type - Routine type (morning/night)
 * @param {string} params.skinType - User's skin type
 * @param {Array} params.skinConcerns - User's skin concerns
 * @returns {Promise<Object>} - Generated routine data
 */
export const generateSkincareRoutine = async ({ products, type, skinType, skinConcerns }) => {
  try {
    // Build detailed product information
    const productDetails = products.map(p => ({
      name: p.name,
      brand: p.brand,
      type: p.type,
      ingredients: p.keyIngredients?.map(i => i.name).join(', ') || 'Not specified',
      usage: p.usage
    }));

    // Create comprehensive prompt
    const prompt = `You are an expert skincare advisor. Generate a personalized ${type} skincare routine.

**User Information:**
- Skin Type: ${skinType || 'Not specified'}
- Skin Concerns: ${skinConcerns?.join(', ') || 'Not specified'}
- Routine Type: ${type.toUpperCase()}

**Available Products:**
${productDetails.map((p, i) => 
  `${i + 1}. ${p.name} by ${p.brand} (${p.type})
     - Key Ingredients: ${p.ingredients}
     - Usage: ${p.usage}`
).join('\n')}

**Instructions:**
1. Select the most appropriate products for this ${type} routine
2. Arrange them in the correct order (e.g., Cleanser → Toner → Serum → Moisturizer → Sunscreen for morning)
3. For each product, provide:
   - Step number
   - Product name
   - Brief instruction (1-2 sentences)
   - Wait time if needed (in minutes)
4. Identify any compatibility warnings (e.g., retinol + vitamin C, AHA + retinol)
5. Keep the routine practical (4-8 steps maximum)

**Response Format (JSON):**
{
  "steps": [
    {
      "stepNumber": 1,
      "productName": "Product Name",
      "instruction": "Application instruction",
      "waitTime": 0
    }
  ],
  "compatibilityWarnings": ["warning 1", "warning 2"],
  "estimatedDuration": 10,
  "tips": ["tip 1", "tip 2"]
}

Respond ONLY with valid JSON, no additional text.`;

    const aiResponse = await getGeminiResponse(prompt);
    
    // Parse AI response
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = aiResponse.trim();
      
      // Remove ```json and ``` markers
      cleanedResponse = cleanedResponse.replace(/^```json\s*/i, '');
      cleanedResponse = cleanedResponse.replace(/^```\s*/i, '');
      cleanedResponse = cleanedResponse.replace(/\s*```$/i, '');
      
      // Try to extract JSON from response
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = JSON.parse(cleanedResponse);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      console.error('Parse error:', parseError.message);
      throw new Error('AI generated invalid response format');
    }

    return parsedResponse;
  } catch (error) {
    console.error('Error generating skincare routine:', error.message);
    throw error;
  }
};

export default {
  getGeminiResponse,
  generateSkincareRoutine
};
