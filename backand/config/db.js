import mongoose from "mongoose"; 
// mongoose लाइब्रेरी को import कर रहे हैं ताकि MongoDB से connection बनाया जा सके

export const connectDB = async () => { 
// connectDB नाम का async function बना रहे हैं जो database से connection करेगा

  try { 
  // try block में हम database connection का code लिखते हैं ताकि error को handle किया जा सके

    const conn = await mongoose.connect(process.env.MONGO_URL); 
    // mongoose.connect() से MongoDB Atlas से connection बना रहे हैं
    // process.env.MONGO_URL .env file से database URL लेता है
    // await का मतलब है connection बनने तक wait करना

    console.log(`MongoDB Connected successfully : ${conn.connection.host}`); 
    // अगर connection सफल हो जाता है तो console में database host दिखाया जाएगा

  } catch (error) { 
  // अगर connection के दौरान कोई error आती है तो catch block चलेगा

    console.error(`Error: ${error.message}`); 
    // error का message console में print करेगा

    process.exit(1); 
    // अगर database connect नहीं हुआ तो application को बंद कर देगा
  }
};