const express =require('express')
const db =require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.get('/commit/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_eva} = req.params
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_eva=? and c.id_eva=e.id_eva and  c.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva`,[id_eva] )
        res.json(rows)
    } catch (error) {
        console.error('Error get commit ',error)
        res.stutus(500).json({message:'Error get commit'})
    }
})

router.get('/scores/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select * from tb_indicate i,tb_evadetail d where d.id_indicate=i.id_indicate and status_eva in (2,3,4) order by id_eva=?`,[id_eva])
        const scores = {}
        rows.map(row=>{
            const id = row.id_indicate
            const score = row.score_commit
            const status = row.status_eva
            const point = row.point_indicate
            if(!scores[id])[
                scores[id]={
                    a:null,
                    b:null,
                    c:null,
                }
            ]
            if(status === 2)scores[id].a = score*point
            if(status === 3)scores[id].b = score*point
            if(status === 4)scores[id].c = score*point
        })
        res.json(scores)
    } catch (error) {
        console.error('Error get scores',error)
        res.stutus(500).json({message:'Error get scores'})
    }
})

router.get('/topic',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate`)
        const result = topics.map(t=>({
            ...t, indicates:indicates.filter((i)=> i.id_topic === t.id_topic)
        }))
        res.json(result)
    } catch (error) {
        console.error('Error get Topic',error)
        res.status(500),json({message:'Error get Topic'})
    }
})

module.exports = router