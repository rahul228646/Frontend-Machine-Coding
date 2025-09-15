export const fileData = [
  {
    id: crypto.randomUUID(),
    name: "Explorer",
    isFolder: true,
    children: [
      {
        id: crypto.randomUUID(),
        name: "public",
        isFolder: true,
        children: [
          {
            id: crypto.randomUUID(),
            name: "hello.js",
            isFolder: false,
            children: [],
          },
          {
            id: crypto.randomUUID(),
            name: "hi.js",
            isFolder: false,
            children: [],
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: "src",
        isFolder: true,
        children: [],
      },

      {
        id: crypto.randomUUID(),
        name: "package.js",
        isFolder: false,
        children: [],
      },
    ],
    diableDelete: true,
  },
];

export const fileDataOptimized = {
  1: {
    id: 1,
    name: "Explorer",
    isFolder: true,
    children: [2, 5, 6],
    disableDelete: true,
  },
  2: { id: 2, name: "public", isFolder: true, children: [3, 4], parent: 1 },
  3: { id: 3, name: "hello.js", isFolder: false, children: [], parent: 2 },
  4: { id: 4, name: "hi.js", isFolder: false, children: [], parent: 2 },
  5: { id: 5, name: "src", isFolder: true, children: [], parent: 1 },
  6: { id: 6, name: "package.js", isFolder: false, children: [], parent: 1 },
};
