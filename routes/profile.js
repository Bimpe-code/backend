fetch("api/user/profile", {
  headers:{
    Authorization:
    localStorage.getItem("token")
  },
})

router.get("/profile", auth, (req,res) =>{
  res.json({msg: "Protected route", userId: req.user.id});
})