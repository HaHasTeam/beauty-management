export interface ICategoryDetail {
  field1: {
    type: string
  }
  field2: {
    type: string
    options: string[]
  }
}

export interface ICategory {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
  detail?: ICategoryDetail
  parentCategory?: ICategory | null
  subCategories?: ICategory[]
}

export const categories: ICategory[] = [
  {
    id: '2769b02f-5af4-402e-854f-9ef6f404ec92',
    createdAt: '2024-11-29T18:11:31.499Z',
    updatedAt: '2024-11-29T18:11:31.499Z',
    name: 'moon cream',
    detail: {
      field1: {
        type: 'text'
      },
      field2: {
        type: 'multiplechoice',
        options: ['a', 'b']
      }
    },
    parentCategory: null,
    subCategories: [
      {
        id: '7809e6c9-9e65-4b22-805d-28f0d70636bc',
        createdAt: '2024-11-29T18:12:00.062Z',
        updatedAt: '2024-11-29T18:12:00.062Z',
        name: 'child cream',
        detail: {
          field1: {
            type: 'text'
          },
          field2: {
            type: 'multiplechoice',
            options: ['a', 'b']
          }
        }
      }
    ]
  },
  {
    id: '7809e6c9-9e65-4b22-805d-28f0d70636bc',
    createdAt: '2024-11-29T18:12:00.062Z',
    updatedAt: '2024-11-29T18:12:00.062Z',
    name: 'child cream',
    detail: {
      field1: {
        type: 'text'
      },
      field2: {
        type: 'multiplechoice',
        options: ['a', 'b']
      }
    },
    parentCategory: {
      id: '2769b02f-5af4-402e-854f-9ef6f404ec92',
      createdAt: '2024-11-29T18:11:31.499Z',
      updatedAt: '2024-11-29T18:11:31.499Z',
      name: 'moon cream',
      detail: {
        field1: {
          type: 'text'
        },
        field2: {
          type: 'multiplechoice',
          options: ['a', 'b']
        }
      }
    },
    subCategories: [
      {
        id: '60950a22-c454-4e1d-873c-a434231cb5e4',
        createdAt: '2024-11-29T18:14:55.806Z',
        updatedAt: '2024-11-29T18:14:55.806Z',
        name: 'child child cream',
        detail: {
          field1: {
            type: 'text'
          },
          field2: {
            type: 'multiplechoice',
            options: ['a', 'b']
          }
        }
      }
    ]
  },
  {
    id: '60950a22-c454-4e1d-873c-a434231cb5e4',
    createdAt: '2024-11-29T18:14:55.806Z',
    updatedAt: '2024-11-29T18:14:55.806Z',
    name: 'child child cream',
    detail: {
      field1: {
        type: 'text'
      },
      field2: {
        type: 'multiplechoice',
        options: ['a', 'b']
      }
    },
    parentCategory: {
      id: '7809e6c9-9e65-4b22-805d-28f0d70636bc',
      createdAt: '2024-11-29T18:12:00.062Z',
      updatedAt: '2024-11-29T18:12:00.062Z',
      name: 'child cream',
      detail: {
        field1: {
          type: 'text'
        },
        field2: {
          type: 'multiplechoice',
          options: ['a', 'b']
        }
      }
    },
    subCategories: [
      // {
      //   id: '905578a6-f410-495d-bb97-c8c9f3640ad0',
      //   createdAt: '2024-11-29T18:16:00.267Z',
      //   updatedAt: '2024-11-29T18:16:00.267Z',
      //   name: 'child child child cream',
      //   detail: {
      //     field1: {
      //       type: 'text'
      //     },
      //     field2: {
      //       type: 'multiplechoice',
      //       options: ['a', 'b']
      //     }
      //   }
      // }
    ]
  },
  // {
  //   id: '905578a6-f410-495d-bb97-c8c9f3640ad0',
  //   createdAt: '2024-11-29T18:16:00.267Z',
  //   updatedAt: '2024-11-29T18:16:00.267Z',
  //   name: 'child child child cream',
  //   detail: {
  //     field1: {
  //       type: 'text'
  //     },
  //     field2: {
  //       type: 'multiplechoice',
  //       options: ['a', 'b']
  //     }
  //   },
  //   parentCategory: {
  //     id: '60950a22-c454-4e1d-873c-a434231cb5e4',
  //     createdAt: '2024-11-29T18:14:55.806Z',
  //     updatedAt: '2024-11-29T18:14:55.806Z',
  //     name: 'child child cream',
  //     detail: {
  //       field1: {
  //         type: 'text'
  //       },
  //       field2: {
  //         type: 'multiplechoice',
  //         options: ['a', 'b']
  //       }
  //     }
  //   },
  //   subCategories: [
  //     {
  //       id: '4bd783c4-4a85-4234-9c91-27ad01fba7e6',
  //       createdAt: '2024-11-29T18:18:42.399Z',
  //       updatedAt: '2024-11-29T18:18:42.399Z',
  //       name: 'child child child child cream',
  //       detail: {
  //         field1: {
  //           type: 'text'
  //         },
  //         field2: {
  //           type: 'multiplechoice',
  //           options: ['a', 'b']
  //         }
  //       }
  //     }
  //   ]
  // },
  {
    id: 'c22af4b2-14ad-403f-802a-3ca5a81b1874',
    createdAt: '2024-11-29T18:10:11.936Z',
    updatedAt: '2024-11-29T18:10:11.936Z',
    name: 'sun cream',
    detail: {
      field1: {
        type: 'text'
      },
      field2: {
        type: 'multiplechoice',
        options: ['a', 'b']
      }
    },
    parentCategory: null,
    subCategories: []
  },
  {
    id: '4bd783c4-4a85-4234-9c91-27ad01fba7e6',
    createdAt: '2024-11-29T18:18:42.399Z',
    updatedAt: '2024-11-29T18:18:42.399Z',
    name: 'child child child child cream',
    detail: {
      field1: {
        type: 'text'
      },
      field2: {
        type: 'multiplechoice',
        options: ['a', 'b']
      }
    },
    parentCategory: {
      id: '905578a6-f410-495d-bb97-c8c9f3640ad0',
      createdAt: '2024-11-29T18:16:00.267Z',
      updatedAt: '2024-11-29T18:16:00.267Z',
      name: 'child child child cream',
      detail: {
        field1: {
          type: 'text'
        },
        field2: {
          type: 'multiplechoice',
          options: ['a', 'b']
        }
      }
    },
    subCategories: []
  },
  {
    id: '4126a5f7-f5a5-4d21-89b8-dac9f8d8ea50',
    createdAt: '2024-11-29T18:11:37.265Z',
    updatedAt: '2024-11-29T18:11:37.265Z',
    name: 'new cream',
    detail: {
      field1: {
        type: 'text'
      },
      field2: {
        type: 'multiplechoice',
        options: ['a', 'b']
      }
    },
    parentCategory: null,
    subCategories: []
  }
]
