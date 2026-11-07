const express =require('express')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/signature')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const fs = require('fs')
const router = express.Router()

router.post('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try {
        const id_member = req.user.id_member
        const id_eva =req.params.id_eva
        const file = req.files?.file
        const maxSize = 10 * 1024 *1024
        if(!file){
            return res.status(400).json({message:"กรุณาเลือกไฟล์เอกสาร"})
        }
        if(file.size > maxSize){
            return res.status(400).json({message:"ไฟล์มีขนาดเกิน 10MB"})
        }
        const filename = Date.now() + path.extname(file.name)
        await file.mv(path.join(uploadDir,filename))
        await db.query(`update tb_commit set signature=? where id_member=? and id_eva=?`,[filename,id_member,id_eva])

        const [SumCommit] = await db.query(`select * from tb_commit where status_commit=? and signature!='${null}' and id_eva=?`,['y',id_eva])
        if(SumCommit.length === 3){
            await db.query(`update tb_eva set status_eva=? where id_eva=? `,[3,id_eva])
        }
        res.status(201).json({message:"Uploads Success"})
    } catch (error) {
        console.error("save error",error);
        res.status(500).json({message:"save error"})
        
    }
    
})

router.delete('/delete/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try {
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[d]] = await db.query(`select signature from tb_commit where id_member=? and id_eva=?`,[id_member,id_eva])
        if(!d){
            return res.status(404).json({message:"ไม่พบข้อมูลการประเมินของกรรมการ"})
        }
        if(d.signature){
            const fp = path.join(uploadDir,d.signature)
            if(fs.existsSync(fp)){
                fs.unlinkSync(fp)
            }
        }
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[null,id_eva,id_member])
        res.status(201).json({message:"Delect Success"})
    } catch (error) {
        console.error("delete error",error);
        res.status(500).json({message:"delete error"})
        
    }
    
})

router.get('/show/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try {
        const id_member  = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select signature from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member]) 
        res.json(rows[0])
        
    } catch (error) {
        console.error("error get",error);
        res.status(500).json({message:"Error get"})
    }
})

module.exports = router