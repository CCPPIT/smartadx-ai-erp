import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Use environment variable
});

export interface AIAdGenerationRequest {
  prompt: string;
  platform: string;
  format: string;
  language: string;
}

export interface AIAdGenerationResponse {
  content: string;
  imageUrl?: string;
  suggestions: string[];
}

export class AIService {
  /**
   * Generate AI ad content based on prompt and platform
   */
  static async generateAdContent(request: AIAdGenerationRequest): Promise<AIAdGenerationResponse> {
    try {
      // If no API key is provided, return simulated response
      if (!process.env.OPENAI_API_KEY) {
        console.warn('No OpenAI API key provided, returning simulated response');
        return this.getSimulatedResponse(request);
      }

      // Create prompt for ad generation
      const systemPrompt = `You are an expert in creating advertising content for social media platforms. 
      Create compelling ad content in ${request.language} for ${request.platform} in ${request.format} format.
      The user has provided the following description: "${request.prompt}".
      Respond with the ad content and up to 3 suggestions for improving the ad.`;

      const userPrompt = `Create an engaging ad for: ${request.prompt}
      Platform: ${request.platform}
      Format: ${request.format}
      Language: ${request.language}
      
      Please structure your response as follows:
      1. Ad Content (2-3 short paragraphs)
      2. Suggestions (3 bullet points for improving the ad)`;

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      
      // Parse the response to extract content and suggestions
      const parsedResponse = this.parseAIResponse(responseText);
      
      return {
        content: parsedResponse.content,
        suggestions: parsedResponse.suggestions,
        imageUrl: this.generatePlaceholderImage(request.platform)
      };
    } catch (error) {
      console.error('Error generating AI ad content:', error);
      // Return simulated response in case of error
      return this.getSimulatedResponse(request);
    }
  }

  /**
   * Parse AI response to extract content and suggestions
   */
  private static parseAIResponse(responseText: string): { content: string; suggestions: string[] } {
    // Simple parsing - in a real implementation, you might want more sophisticated parsing
    const lines = responseText.split('\n').filter(line => line.trim() !== '');
    
    let content = '';
    const suggestions: string[] = [];
    let isSuggestionsSection = false;
    
    for (const line of lines) {
      if (line.includes('Suggestions') || line.includes('الاقتراحات') || 
          (line.startsWith('2.') && line.includes('uggestion'))) {
        isSuggestionsSection = true;
        continue;
      }
      
      if (isSuggestionsSection) {
        if (line.trim().startsWith('-') || line.trim().startsWith('•') || 
            line.trim().startsWith('*') || line.includes('uggestion')) {
          suggestions.push(line.replace(/^[-•*\d.\s]+/, '').trim());
        }
      } else {
        if (!line.includes('Ad Content') && !line.includes('المحتوى') && 
            !line.startsWith('1.')) {
          content += line + '\n';
        }
      }
    }
    
    // If we couldn't parse properly, return the whole response as content
    if (!content.trim()) {
      content = responseText;
    }
    
    return {
      content: content.trim(),
      suggestions: suggestions.slice(0, 3)
    };
  }

  /**
   * Generate placeholder image URL based on platform
   */
  private static generatePlaceholderImage(platform: string): string {
    const platformColors: Record<string, string> = {
      'facebook': '3b5998',
      'google': '4285f4',
      'twitter': '1da1f2',
      'linkedin': '0077b5',
      'tiktok': '69c9d0',
      'instagram': 'e1306c'
    };
    
    const color = platformColors[platform] || '667eea';
    return `https://placehold.co/600x400/${color}/white?text=${encodeURIComponent(platform)}`;
  }

  /**
   * Generate simulated response when AI is not available
   */
  private static getSimulatedResponse(request: AIAdGenerationRequest): AIAdGenerationResponse {
    return {
      content: `إعلان ذكي مولّد تلقائيًا لمنصة ${request.platform} 
      بناءً على الطلب: "${request.prompt}". 
      ${request.format ? `التنسيق: ${request.format}` : 'تنسيق قياسي'}.
      
      هذا إعلان تجريبي تم إنشاؤه باستخدام الذكاء الاصطناعي. في التطبيق الحقيقي، 
      سيتم إنشاء محتوى فريد ومخصص بناءً على احتياجاتك و الجمهور المستهدف.`,
      suggestions: [
        'جرب تعديل نص الإعلان لزيادة معدل النقر',
        'استخدم صورًا مختلفة لتحسين التفاعل',
        'غيّر الجمهور المستهدف لزيادة التحويلات'
      ],
      imageUrl: this.generatePlaceholderImage(request.platform)
    };
  }
}