import * as yup from 'yup';

const rssUrlSchema = yup.string().url('URL должен быть валидным').test(
  'is-rss',
  'URL должен быть ссылкой на RSS-поток',
  value => value.endsWith('.rss') || value.endsWith('.xml')
);

export const validateURL = (url, existingUrls) => {
  if (!url) {
    return Promise.resolve({ valid: true });
  }

  return rssUrlSchema.validate(url)
    .then(validUrl => {
      if (existingUrls.includes(validUrl)) {
        return Promise.reject(new Error('URL уже добавлен'));
      }
      return { valid: true };
    })
    .catch(error => {
      return { valid: false, error: error.message };
    });
};
