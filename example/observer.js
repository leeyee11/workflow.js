const { createWorkFlow } = require('../dist/index');

const article = {
  title: null,
  type: null,
  author: null,
  date: null,
  content: {
    summary: null,
    mainContent: null
  }
}
const workflow = createWorkFlow({
  vertices: [
    'created',
    'draft',
    'published',
    'deleted'
  ],
  edges: [
    {
      source: 'created',
      target: 'draft',
      validators: [
        (article) => !!article.title
      ]
    },
    {
      source: 'draft',
      target: 'published',
      validators: [
        (article) => !!article.author
        , (article) => !!article.date &&
          !!(article.date.getTime() < new Date().getTime())
        , (article) => !!article.content.summary &&
          !!article.content.paragraph
      ]
    },
    {
      source: 'published',
      target: 'deleted',
      validators: []
    },
    {
      source: 'published',
      target: 'draft',
      validators: []
    },
    {
      source: 'draft',
      target: 'deleted',
      validators: [
        (article) => !!article.author
      ]
    }
  ],
  entry: 'created',
  context: article
})

workflow.getObserver()
  .observe(
    { "stage": 'failed' },
    (data) => console.log(
      `================ failed ===============\n`+
      `current: ${data._state}\n`+
      `target: ${data.target}\n`+
      `message: ${data.message}\n`+
      `=======================================\n`
    )
  );

  workflow.getObserver()
  .observe(
    { "stage": 'finished' },
    (data) => console.log(
      `================ finished =============\n`+
      `current: ${data._state}\n`+
      `target: ${data.target}\n`+
      `message: ${data.message}\n`+
      `=======================================\n`
    )
  );

workflow.goTo('draft');
console.log('>>>> Set article title ... \n')
article.title = "Sample Article Title"
workflow.goTo('draft');
workflow.goTo('published');
console.log('>>>>> Set article author, date, summary, postContent ... \n')
article.author = "LeeYee11";
article.date = new Date('2020-01-11');
article.content.summary = "Not available"
article.content.paragraph = "Long long ago ..."
workflow.goTo('published');
workflow.goTo('draft');
workflow.goTo('created');
