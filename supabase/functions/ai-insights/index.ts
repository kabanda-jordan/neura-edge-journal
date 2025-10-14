import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { trades, type = 'insights', question } = body;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating AI insights for', trades?.length || 0, 'trades');

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'insights') {
      systemPrompt = `You are an expert trading coach analyzing trading performance. 
      Provide 3 specific, actionable insights based on the trading data.
      Each insight should include:
      - A clear pattern or finding
      - Specific metrics or examples
      - An actionable recommendation
      
      Format your response as a JSON array with this structure:
      [{"type": "warning", "title": "...", "message": "...", "color": "text-orange-500"}]
      
      Type can be: warning, success, or tip
      Color should be: text-orange-500 for warning, text-green-500 for success, text-blue-500 for tip`;
      
      userPrompt = `Analyze this trading data and provide 3 insights:\n${JSON.stringify(trades, null, 2)}`;
    } else if (type === 'question') {
      systemPrompt = `You are an expert trading coach. Answer questions about trading performance with specific, data-driven insights.`;
      userPrompt = `Trading data:\n${JSON.stringify(trades, null, 2)}\n\nQuestion: ${question}`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-insights function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
