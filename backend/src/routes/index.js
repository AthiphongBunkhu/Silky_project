const router = require('express').Router();
const modelUser = require('../models/user');
const bcrypt = require('bcrypt');
const roomModel = require('../models/room');
const room = require('../models/room');



const generatePassword = async (password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHashed = await bcrypt.hash(password, salt);
    return passwordHashed;
};


const comparePassword = async (pass_login, pass_user) => {
    return await bcrypt.compare(pass_login, pass_user);
};


router.post('/register', async (req, res) => {
    try {

        let data = req.body;

        data.password = await generatePassword(data.password);
        let user = new modelUser({
            username: data.username,
            firstname: data.firstname,
            lastname: data.lastname,
            password: data.password,
            email: data.email
        });
        
        user.save();
        res.status(200).json({ 
            msg: 'สมัครสมาชิกสำเร็จ', 
            data: user 
        });

    } catch (err) { 

        res.status(400).json({ 
            msg: 'สมัครสมาชิกไม่สำเร็จ', 
            err: err.message 
        });

    }
});


router.post('/login', async (req, res) => {
    try {
        let data = req.body;

        const user = await modelUser.findOne({'username': data.username});
        if (user && await comparePassword(data.password, user.password)) {
            user.password = undefined;
            delete user.password;
            req.session.dataUser = user;
            res.status(200).json({ 
                msg: 'เข้าสู่ระบบสำเร็จ', 
                data: user,
            });
            return;
        } else {
            throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        } 

    } catch (err) { 

        res.status(400).json({ 
            msg: 'เกิดข้อผิดพลาด', 
            err: err.message 
        });

    }
});


router.get('/checkUserLogin', async (req, res) => {
    try {

        res.status(200).json(req.session.dataUser);
        return;
    } catch (err) {

        res.status(400).json({ 
            msg: 'เกิดข้อผิดพลาด', 
            err: err.message 
        });

    }
});


router.get('/logout', async (req, res) => {
    try {

        req.session.dataUser = null;
        delete req.session.dataUser;
        res.status(200).json({
            msg: 'ออกจากระบบสำเร็จ'
        })
        
    } catch (err) {

        res.status(400).json({ 
            msg: 'เกิดข้อผิดพลาด', 
            err: err.message 
        });

    }
});

router.post('/addRoom', async (req, res) => {
    let data = {}
    try{
        
        data = {
            roomNo: req.body.roomNo,
            price: req.body.price,
            roomType: req.body.roomType,
            roomStatus: req.body.roomStatus
        }
        console.log(data)
        const response = await roomModel.create(data)
        res.json({ status: 'success' })
        
        
    } catch (error) {
        console.log(error)
        res.json({ status: 'error' })
    }
});

router.get('/getRoom/:id', async (req, res) => {
    try {
        const room = await roomModel.findOne({_id: req.params.id})
        res.status(200).json({result: room, msg: 'Get room success'})
    }catch(err){
        return res.status(500).json({message: err.message});
    }
    
});

router.route('/edit-room/:id').get((req, res, next) => {
    roomModel.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data);
        }
    })
});

router.route('/update-room/:id').put((req, res, next) => {
    roomModel.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
            console.log('Room update');
        }
    })
})

router.get('/findRoom', async (req,res)=>{
    try{
        const room = await roomModel.find(req.params.id)
        res.status(200).json({room, msg: 'Get room success'})
    }catch(error){
        return res.status(500).json({message: err.message});
    }
})

// Delete student data
router.route('/delete-room/:id').delete((req, res, next) => {
    roomModel.findByIdAndDelete(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = router;