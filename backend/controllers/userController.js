const queries = require("./../models/queries/userQueries");

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates.", 400));
  }

  const allowedFields = ["fname", "lname", "email", "phone", "address"];
  const filteredBody = {};
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });

  const pool = await poolPromise;
  await pool
    .request()
    .input("id", sql.Int, req.user.user_id)
    .input("fname", sql.NVarChar, filteredBody.fname)
    .input("lname", sql.NVarChar, filteredBody.lname)
    .input("phone", sql.VarChar, filteredBody.phone)
    .input("address", sql.NVarChar, filteredBody.address)
    .query(queries.UPDATE_USER);

  res.status(200).json({ status: "success", message: "Profile updated" });
});
