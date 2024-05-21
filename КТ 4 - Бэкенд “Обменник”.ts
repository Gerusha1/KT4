interface IUser 
{
    uid: string
    login: string
    password: string
    online: boolean
    phone?: string
    age?: number
    cardNumber?: string
    country?: string
    verified: boolean
    balance: number
}

const users: IUser[] = []

function signUp(login: string, password: string, repeatPassword: string): any 
{
    if (password !== repeatPassword) 
    {
        return {"status": 400, "text": "Bad Request", "message": "Passwords do not match"}
    }

    if (login.length < 6 || password.length < 6) 
    {
        return {"status": 400, "text": "Bad Request", "message": "Login and password must be at least 6 characters long"}
    }

    if (/[^a-zA-Z0-9]/.test(login)) 
    {
        return {"status": 400, "text": "Bad Request", "message": "Login cannot contain special characters"}
    }

    if (users.some(user => user.login === login)) 
    {
        return {"status": 400, "text": "Bad Request", "message": "Login is already taken"}
    }

    const newUser: IUser = 
    {
        uid: Math.random().toString(36).substr(2, 9),
        login,
        password,
        online: false,
        verified: false,
        balance: 0
    }

    users.push(newUser)
    return signIn(login, password)
}

function signIn(login: string, password: string): any 
{
    const user = users.find(user => user.login === login && user.password === password)
    
    if (!user) 
    {
        return {"status": 401, "text": "Unauthorized", "message": "Invalid credentials"}
    }
    user.online = true
    return {"status": 200, "text": "OK", "message": "Login success"}
}

function verify(user: IUser, phone: string, age: number, cardNumber: string, country: string): any 
{
    if (!user.phone) user.phone = phone
    if (!user.age) user.age = age
    if (!user.cardNumber) user.cardNumber = cardNumber
    if (!user.country) user.country = country
    user.verified = true
    return {"status": 200, "text": "OK", "message": "User verified"}
}

function forgetPwd(phone: string, password: string): any 
{
    const user = users.find(user => user.phone === phone)
    if (!user || user.password !== password) 
    {
        return {"status": 401, "text": "Unauthorized", "message": "Invalid phone number or password"}
    }
    return {"status": 200, "text": "OK", "message": "Password reset successful"}
}

function transactionTrigger(senderUid: string, receiverUid: string, amount: number): any 
{
    const sender = users.find(user => user.uid === senderUid)
    const receiver = users.find(user => user.uid === receiverUid)

    if (!sender || !receiver) 
    {
        return {"status": 400, "text": "Bad Request", "message": "Sender or receiver not found"}
    }

    if (sender.balance < amount || receiver.balance < amount) 
    {
        return {"status": 400, "text": "Bad Request", "message": "Insufficient balance for transaction"}
    }

    // Perform transaction logic here
    return {"status": 200, "text": "OK", "message": "Transaction initiated successfully"}
}

function transactionReceive(receiverUid: string, amount: number): any 
{
    const receiver = users.find(user => user.uid === receiverUid)
    if (!receiver) {
        return {"status": 400, "text": "Bad Request", "message": "Receiver not found"}
    }
    receiver.balance += amount
    return {"status": 200, "text": "OK", "message": receiver ${amount} units successfully}
}
