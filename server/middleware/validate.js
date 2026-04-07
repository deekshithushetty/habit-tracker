const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const messages = result.error.issues.map(issue => {
        const field = issue.path.join('.');
        return `${field}: ${issue.message}`;
      });

      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: messages
        }
      });
    }

    // Replace body with parsed/cleaned data
    req.body = result.data;
    next();
  };
};

module.exports = validate;