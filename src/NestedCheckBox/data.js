// export const data = {
//   1: {
//     id: 1,
//     name: "parent 1",
//     Children: [2, 8, 9],
//     checked: false,
//   },
//   2: {
//     id: 2,
//     name: "parent 2",
//     Children: [3, 4, 5],
//     checked: false,
//   },
//   3: {
//     id: 3,
//     name: "child 1",
//     checked: false,
//     Children: [],
//   },
//   4: {
//     id: 4,
//     name: "child 2",
//     checked: false,
//     Children: [],
//   },
//   5: {
//     id: 5,
//     name: "child 3",
//     checked: false,
//     Children: [6, 7],
//   },
//   6: {
//     id: 6,
//     name: "child 5",
//     checked: false,
//     Children: [],
//   },
//   7: {
//     id: 7,
//     name: "child 5",
//     checked: false,
//     Children: [],
//   },
//   8: {
//     id: 8,
//     name: "parent 3",
//     Children: [2],
//     checked: false,
//   },
//   9: {
//     id: 9,
//     name: "parent 4",
//     Children: [],
//     checked: false,
//   },
// };

export const data = [
  {
    id: 1,
    name: "parent 1",
    checked: false,
    children: [
      {
        id: 2,
        name: "parent 2",
        checked: false,
        children: [
          {
            id: 3,
            name: "child 1",
            checked: false,
            children: [],
          },
          {
            id: 4,
            name: "child 2",
            checked: false,
            children: [],
          },
          {
            id: 5,
            name: "child 3",
            checked: false,
            children: [
              {
                id: 6,
                name: "child 5",
                checked: false,
                children: [],
              },
              {
                id: 7,
                name: "child 5",
                checked: false,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 8,
        name: "parent 3",
        checked: false,
        children: [],
      },
      {
        id: 9,
        name: "parent 4",
        checked: false,
        children: [],
      },
    ],
  },
];
