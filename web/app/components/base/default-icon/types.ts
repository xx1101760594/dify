export enum BlockEnum {
  Start = 'start',
  End = 'end',
  Answer = 'answer',
  LLM = 'llm',
  KnowledgeRetrieval = 'knowledge-retrieval',
  QuestionClassifier = 'question-classifier',
  IfElse = 'if-else',
  Code = 'code',
  TemplateTransform = 'template-transform',
  HttpRequest = 'http-request',
  VariableAssigner = 'variable-assigner',
  VariableAggregator = 'variable-aggregator',
  Tool = 'tool',
  ParameterExtractor = 'parameter-extractor',
  Iteration = 'iteration',
  DocExtractor = 'document-extractor',
  ListFilter = 'list-operator',
  IterationStart = 'iteration-start',
  Assigner = 'assigner', // is now named as VariableAssigner
  Agent = 'agent',
  Loop = 'loop',
  LoopStart = 'loop-start',
  LoopEnd = 'loop-end',
}


export type Block = {
  classification?: string
  type: BlockEnum
  title: string
  description?: string
}

export enum BlockClassificationEnum {
  Default = '-',
  QuestionUnderstand = 'question-understand',
  Logic = 'logic',
  Transform = 'transform',
  Utilities = 'utilities',
}