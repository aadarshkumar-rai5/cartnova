export default function errorMiddleware(error, req, res, next) {
  let status = error.status || 500;
  let message = error.message;
  if (error.code === 11000) {
    status = 409;
    message = 'This email is already registered.';
  }
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    status = 400;
    message = 'Please check the supplied fields or ID.';
  }
  if (status >= 500) {
    console.error(error.message);
    message = 'Something went wrong. Please try again.';
  }
  res.status(status).json({ message });
}
