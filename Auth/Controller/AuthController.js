const User = require('../models/User')
const Role = require('../models/Role')
const jwt = require('jsonwebtoken')
const { hashSync, compareSync } = require("bcrypt");
const Product = require('../../Products/Models/Product')

const generateToken = (id) => {
    const payload = {
        id,
    }
    return jwt.sign(payload, "jXSFM1kfpDMF7RB7", { expiresIn: '24h' })
}

class AuthController {
    async registration(req, res) {
        try {
            const { name, surname, email, phone, password, roles } = req.body;
            if (!name && !surname && !email && !phone && !password && !roles) {
                res.status(400).json({ status: 400 })
            }
            const hashPassword = hashSync(password, 7)
            const userRole = await Role.findOne({ value: 'Пользователь' })
            const user = await new User({
                name,
                surname,
                email,
                phone,
                password: hashPassword,
                roles: [userRole.value]
            }).save();

            return res.status(200).send(user)
        } catch (e) {
            console.log(e)
        }
    }

    async authorization(req, res) {
        try {
            const { email, password } = req.body;
            if (!email) {
                res.status(401).json({ status: 'Email' })
            }
            const user = await User.findOne({ email })

            if (!user) {
                res.status(401).json({ status: 'user' })
            }
            const validPass = compareSync(password, user.password)
            if (!validPass) {
                return res.status(400).json({ status: 'Password incorrect' })
            }
            const token = generateToken(user._id)

            res.status(200).json({ token })
        } catch (e) {
            console.log(e)
        }
    }
    async changeRole(req, res) {
        const { id, role } = req.body;

        try {
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            user.roles = [role];
            await user.save();

            return res.status(200).json({ message: 'User role changed successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (e) {
            console.log(e)
        }
    }
    async verify(req, res) {
        const { token } = req.body;

        try {
            const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7")
            const id = decoded.id
            res.status(200).json({ id })
        } catch (e) {
            console.log(e)
        }
    }
    async likedProduct(req, res) {
        try {
            const { userID, productID } = req.body;

            const user = await User.findById(userID);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            user.liked.push({ productID });
            await user.save();

            return res.status(200).json({ message: 'Product liked successfully' });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async dislikeProduct(req, res) {
        try {
            const { userID, productID } = req.body;

            const user = await User.findById(userID);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            user.liked = user.liked.filter(item => item.productID !== productID);
            await user.save();

            return res.status(200).json({ message: 'Product disliked successfully' });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getUser(req, res) {
        try {
            const { token } = req.body;

            const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7")
            const id = decoded.id

            const user = await User.findById(id);

            if (!user) {
                res.status(404).json({ status: "exist" })
            }
            res.status(200).json({ user })

        } catch (e) { console.log(e) }
    }
    async editUser(req, res) {
        const { id, updatedData } = req.body;

        const user = await User.findById(id)

        user.name = updatedData.name
        user.surname = updatedData.surname
        user.email = updatedData.email
        user.phone = updatedData.phone

        await user.save();

        res.status(200).json({edited: "true"})
    }
    async addOrder(req, res) {
        try {
            const { token, Object } = req.body;

            const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7")
            const id = decoded.id

            const user = await User.findById(id)

            if (!user) {
                res.status(400).json({ status: "exist" })
            }

            user.orders.push(Object)

            await user.save()
            res.status(200).json({created: "true"})
        } catch (e) {
            console.log(e)
        }
    }
    async views(req, res) {
        try {
            const {token, productId} = req.body;
            const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7")
            const id = decoded.id
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({message: 'Пользователь не найден'});
            }

            user.views.unshift(productId);

            if (user.views.length > 16) {
                user.views.pop();
            }

            await user.save();

            return res.status(200).json({message: 'Товар успешно добавлен в просмотры пользователя'});
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Произошла ошибка сервера'});
        }
    }
    async getLiked(req, res) {
        const { token } = req.body;
    
        const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7");
        const id = decoded.id;
        const user = await User.findById(id);
    
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
    
        const likedProducts = user.liked.map(like => like.productID);
        console.log(likedProducts);
    
        const products = [];
    
        for (let i = 0; i < likedProducts.length; i++) {
            try {
                const product = await Product.findById(likedProducts[i]);
                console.log(likedProducts[i]);
                console.log(product);
            
                if (product) {
                    products.push(product);
                } else {
                    console.log(`Product with ID ${likedProducts[i]} not found`);
                }
            } catch (error) {
                console.error("Error fetching product:", error.message);
            }            
        }
    
        res.json({ likedProducts: products });
    }
    async getOrderedProducts(req, res) {
        const { token } = req.body;
    
        const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7");
        const id = decoded.id;
        const user = await User.findById(id);
    
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
    
        const allOrderedProducts = [];
    
        user.orders.forEach(order => {
            const orderProducts = order.order.map(item => item.products);
            allOrderedProducts.push(...orderProducts);
        });
    
        res.json({ orderedProducts: allOrderedProducts });
    }
    async getViews(req, res) {
        const { token } = req.body;
    
        const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7");
        const id = decoded.id;
        const user = await User.findById(id);
    
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
    
        const likedProducts = user.liked.map(like => like.productID);
        console.log(likedProducts);
    
        const products = [];
    
        for (let i = 0; i < likedProducts.length; i++) {
            try {
                const product = await Product.findById(likedProducts[i]);
                console.log(likedProducts[i]);
                console.log(product);
            
                if (product) {
                    products.push(product);
                } else {
                    console.log(`Product with ID ${likedProducts[i]} not found`);
                }
            } catch (error) {
                console.error("Error fetching product:", error.message);
            }            
        }
    
        res.json({ views: products });
    }   
}

module.exports = new AuthController();