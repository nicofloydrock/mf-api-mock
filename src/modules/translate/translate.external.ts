import axios from 'axios';

export const translateExternal = async (
  base: string,
  source: string,
  target: string,
  text: string,
) => {
  const url = `${base}/${source}/${target}/${encodeURIComponent(text)}`;
  const { data } = await axios.get<{ translation: string }>(url, {
    timeout: 5000,
  });
  return data.translation;
};
