export default (state) => {
  const { clickedPost } = state.modal;
  const closestParent = clickedPost.closest('li');
  const linkElement = closestParent.querySelector('a');

  const handlePost = (element) => {
    element.classList.replace('fw-bold', 'fw-normal');
    element.classList.add('link-secondary');
  };

  return handlePost(linkElement);
};
