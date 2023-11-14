const handleCatchedError = ({
  error,
  at = "at position not defined",
  res = null,
  status = 500,
  message = "Server error! Something went wrong."
}) => {
  // console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  console.log(" ////////////////////////// handleCatchedError Start /////////////////////////// ")
  console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  // console.log(" /////////////////////////////////////////////////////////////////////////////// ")

  console.log(" -----------------> [At]:", at, "[Error]: ", error);
  if (res) {
    returnFailureResponse({ res, status, message })
  }


  // console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  console.log(" ////////////////////////// handleCatchedError End ///////////////////////////// ")
  console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  // console.log(" /////////////////////////////////////////////////////////////////////////////// ")
};

const returnCatchedError = ({ res = null, status = 400, error, at = "at position not defined" }) => {
  handleCatchedError({ at, error })
  res.status(status).json(error)
}

const successResponse = ({ data = null, message = null }) => {
  return {
    success: true,
    message,
    data,
  }
}

const failureResponse = ({ data = null, message = null }) => {
  return {
    success: false,
    message,
    data,
  }
}

const returnSuccessResponse = ({ res = null, status = 200, data = null, message = null }) => {
  if (res) {
    res.status(status).send(successResponse({ data, message }))
  }
}

const returnFailureResponse = ({ res = null, status = 400, message = null, }) => {
  res.status(status).json(failureResponse({ message }))
}

const toCapitalCase = (string) => {
  return string?.charAt(0).toUpperCase() + string.slice(1)
}

const checkValidation = (req, res, customBodyParams = null) => {
  const paramsArr = Object.entries(customBodyParams || req.body).map(([key, value]) => ({ key, value }));
  paramsArr?.forEach((item) => {
    if (!item?.value) {
      return returnFailureResponse({ res, message: `${toCapitalCase(item?.key)} is required` })
    }
  })
}

const userRoles = {
  isAdmin: "0",
  user: "1"
}

module.exports = {
  handleCatchedError,
  successResponse,
  failureResponse,
  returnSuccessResponse,
  returnFailureResponse,
  returnCatchedError,
  toCapitalCase,
  checkValidation,
  userRoles
};
