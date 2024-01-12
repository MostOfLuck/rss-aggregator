import * as yup from 'yup';
import i18n from './i18n'; // Убедитесь, что путь к файлу правильный

yup.setLocale({
  string: {
    url: () => i18n.t('valid_url_required')
  }
});

const rssUrlSchema = yup.string().url().test(
  'is-rss',
  () => i18n.t('rss_link_required'),
  value => value && (value.endsWith('.rss') || value.endsWith('.xml'))
);

export const validateURL = (url, existingUrls) => {
  if (!url) {
    return Promise.resolve({ valid: true });
  }

  return rssUrlSchema.validate(url)
    .then(validUrl => {
      if (existingUrls.includes(validUrl)) {
        throw new Error(i18n.t('url_already_added'));
      }
      return { valid: true };
    })
    .catch(error => {
      return { valid: false, error: error.message };
    });
};
