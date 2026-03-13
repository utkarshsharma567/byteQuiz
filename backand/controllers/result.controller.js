import Result from "../models/resultmodels.js";

export const createResult = async (req,resp)=>{
    try {
        if(!req.user || !req.user.id){
            return resp.status(401).json({
                sucess:false,
                message:'Not authorized'
            })
        }
    const { title, technology, level, totalQuestions, correct, wrong } = req.body;
    if(!technology || !level || totalQuestions === undefined || correct === undefined){
        return resp.status(401).json({
                sucess:false,
                message:'missing fields'
            })
    }
   // compute wrong if not provided
    const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));
 if(!title){
        return resp.status(400).json({
                sucess:false,
                message:'missing title'
            })
    }

        const payload = {
      title: String(title).trim(),
      technology,
      level,
      totalQuestions: Number(totalQuestions),
      correct: Number(correct),
      wrong: computedWrong,
      user: req.user.id// for particular user see there data
    };

    const created = await Result.create(payload);
return resp.status(201).json({
    success: true,
    message: 'Result created',
    result: created
})
    } catch (error) {
        console.log("createResult error",error)
        return resp.status(400).json({
                sucess:false,
                message:'server error',
                
            })
    }
}

export const listResult = async(req,resp) => {
    try {
       if(!req.user || !req.user.id){
            return resp.status(401).json({
                sucess:false,
                message:'Not authorized'
            })
        }
        const {technology} = req.query;
        const query = {user:req.user.id};

       if (technology && technology.toLowerCase() !== 'all') {
    query.technology = technology;
}
const items = await Result.find(query).sort({ createdAt: -1 }).lean();    
    return resp.status(200).json({
    success: true,
    results: items
})
    } catch (error) {
        console.log( "Create listsresulterror: ",error)
        return resp.status(500).json({
                sucess:false,
                message:'server error'
            })
    }
}