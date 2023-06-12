export const checkAuthenticted = (req, res, next) =>{
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login')
}