import ChatMessage from '../models/ChatMessage.js';
import Product from '../models/Product.js';
import Routine from '../models/Routine.js';

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;

    const messages = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('context.products', 'name brand type')
      .populate('context.routines', 'name type');

    // Reverse to show oldest first
    messages.reverse();

    res.status(200).json({
      success: true,
      count: messages.length,
      data: { messages }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message and get AI response
// @route   POST /api/chat/message
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;

    // Save user message
    const userMessage = await ChatMessage.create({
      user: req.user._id,
      role: 'user',
      content
    });

    // Get user context (products and routines)
    const products = await Product.find({ user: req.user._id, isActive: true });
    const routines = await Routine.find({ user: req.user._id, isActive: true });

    // Simple AI response logic (in production, integrate with OpenAI/Claude)
    const aiResponse = generateAIResponse(content, products, routines);

    // Save AI message
    const assistantMessage = await ChatMessage.create({
      user: req.user._id,
      role: 'assistant',
      content: aiResponse,
      context: {
        products: products.slice(0, 5).map(p => p._id),
        routines: routines.slice(0, 3).map(r => r._id)
      },
      metadata: {
        model: 'simple-logic',
        responseTime: 100
      }
    });

    // Cleanup old messages (keep last 100)
    await ChatMessage.cleanupOldMessages(req.user._id, 100);

    res.status(201).json({
      success: true,
      data: {
        userMessage,
        assistantMessage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat/history
// @access  Private
export const clearHistory = async (req, res, next) => {
  try {
    await ChatMessage.deleteMany({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Simple AI response generator (replace with actual AI in production)
function generateAIResponse(userMessage, products, routines) {
  const lowerMessage = userMessage.toLowerCase();

  // Product order questions
  if (lowerMessage.includes('order') || lowerMessage.includes('sequence')) {
    return `The correct order for skincare products is: Cleanser → Toner → Serum → Eye Cream → Moisturizer → Sunscreen (for morning). At night, you can skip sunscreen and add treatments like retinol after serum. This order goes from thinnest to thickest consistency, allowing better absorption.`;
  }

  // Retinol questions
  if (lowerMessage.includes('retinol')) {
    return `Retinol is a powerful anti-aging ingredient! Here are key tips:
    
1. Start with 2-3x per week, then gradually increase
2. Always use at night (it's photosensitive)
3. Apply after cleansing and toning
4. Don't mix with vitamin C, AHAs, or BHAs in the same routine
5. Always use sunscreen during the day
6. Wait 20-30 minutes before applying other products

Would you like specific product recommendations?`;
  }

  // Vitamin C questions
  if (lowerMessage.includes('vitamin c')) {
    return `Vitamin C is excellent for brightening and antioxidant protection! Best practices:

1. Use in the morning for daytime protection
2. Apply after cleansing and toning
3. Wait a few minutes before applying other products
4. Store in a cool, dark place
5. Look for L-Ascorbic Acid for best results
6. Don't combine with retinol or niacinamide in the same routine

Your skin will thank you!`;
  }

  // Dry skin questions
  if (lowerMessage.includes('dry') || lowerMessage.includes('dehydrated')) {
    return `For dry skin, focus on hydration and moisture retention:

Key ingredients to look for:
- Hyaluronic Acid (draws moisture)
- Ceramides (repair skin barrier)
- Glycerin (humectant)
- Squalane (locks in moisture)

Routine tips:
1. Use a gentle, non-foaming cleanser
2. Apply products on damp skin
3. Layer hydrating products
4. Use a rich moisturizer
5. Don't skip sunscreen!

Avoid harsh sulfates and alcohol-based products.`;
  }

  // Anti-aging questions
  if (lowerMessage.includes('aging') || lowerMessage.includes('wrinkle')) {
    return `For anti-aging, focus on these proven ingredients:

1. **Retinol/Retinoids** - Gold standard for anti-aging
2. **Vitamin C** - Brightening and antioxidant
3. **Niacinamide** - Improves skin texture
4. **Peptides** - Boost collagen production
5. **SPF** - Most important anti-aging step!

Start with one active ingredient and gradually add more. Consistency is key!`;
  }

  // Product-specific questions
  if (products.length > 0 && (lowerMessage.includes('my product') || lowerMessage.includes('my routine'))) {
    const productTypes = [...new Set(products.map(p => p.type))];
    return `Based on your ${products.length} products (including ${productTypes.slice(0, 3).join(', ')}), you have a good foundation! 

To optimize your routine:
1. Use cleansers twice daily
2. Apply serums after toning
3. Always moisturize
4. Don't skip sunscreen in the morning

Would you like me to help create a personalized routine?`;
  }

  // Default response
  return `I'm here to help with your skincare journey! I can assist with:

- Product ingredient information
- Routine order and timing
- Ingredient compatibility
- Skin concerns (acne, aging, dryness, etc.)
- Product recommendations

${products.length > 0 ? `I see you have ${products.length} products in your collection. ` : ''}What specific question do you have?`;
}
