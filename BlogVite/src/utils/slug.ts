const TURKISH: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
};

export const slugify = (text: string) =>
  text
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşü]/g, (char) => TURKISH[char])
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

export const postPath = (post: { id: number; title: string }) =>
  `/post/${post.id}/${slugify(post.title)}`;
