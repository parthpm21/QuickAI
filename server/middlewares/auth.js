import { clerkClient } from "@clerk/express";



//Middleware to check userId and hasPremiumPlan


export const auth = async (req, res, next) => {
    try {
        const { userId, has } = await req.auth();
        const hasPremiumPlan = await has({ plan: 'premium' });

        const user = await clerkClient.users.getUser(userId);

        req.free_usage = user.privateMetadata.free_usage ?? 0;  // always a number
        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next();

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};