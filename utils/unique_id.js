const candidates = '-_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = (length) =>  {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += candidates.charAt(Math.floor(Math.random() * candidates.length));
  }
  return id;
}
