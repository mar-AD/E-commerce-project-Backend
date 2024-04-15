const express = require("express");

function validateInput(firstName, lastName, email, user_name, password) {
  const errors = [];
  if (!firstName || !firstName.match(/^[A-Za-z ]+$/)) {
    errors.push("Enter your firstname; only letters allowed.");
  }
  if (!lastName || !lastName.match(/^[A-Za-z ]+$/)) {
    errors.push("Enter your lastname; only letters allowed.");
  }
  if (!user_name || !user_name.match(/^[A-Za-z ]+$/)) {
    errors.push("Enter your real name;  only letters allowed.");
  }
  if (
    !email ||
    !email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)
  ) {
    errors.push("Invalid email address.");
  }
  if (!password || password.length < 6) {
    errors.push("Password should be at least 6 characters.");
  }
  return errors;
}

function validatecustomer(firstName, lastName, email, password) {
  const errors = [];
  if (!firstName || !firstName.match(/^[A-Za-z ]+$/)) {
    errors.push("Enter your firstname; only letters allowed.");
  }
  if (!lastName || !lastName.match(/^[A-Za-z ]+$/)) {
    errors.push("Enter your lastname; only letters allowed.");
  }
  if (
    !email ||
    !email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)
  ) {
    errors.push("Invalid email address.");
  }
  if (!password || password.length < 6) {
    errors.push("Password should be at least 6 characters.");
  }
  return errors;
}

function validateProducts(
  product_name,
  shortDescription,
  longDescription,
  price
) {
  const errors = [];
  if (!product_name || product_name.length > 50) {
    errors.push("Product Name must not exceed 50 characters");
  }
  if (!shortDescription || shortDescription.length > 100) {
    errors.push("Short Description must not exceed 100 characters");
  }
  if (!longDescription || longDescription.length > 300) {
    errors.push("Long Description must not exceed 300 characters");
  }
  if (!price ||isNaN(Number(price)) ||Number(price) <= 0 ){
    errors.push(
      "Price must be a number greater than zero"
    );
  }
  return errors;
}

module.exports = {
  validateInput: validateInput,
  validatecustomer: validatecustomer,
  validateProducts: validateProducts,
};
