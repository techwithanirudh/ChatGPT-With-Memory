// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import initOpenAI from "../../lib/ai/openai";

type Option = {
	value: string;
	label: string;
};

type Data = {
	modelOptions: Option[];
};

const modelOptions = [
	{
		"value": "babbage",
		"label": "babbage"
	},
	{
		"value": "davinci",
		"label": "davinci"
	},
	{
		"value": "babbage-code-search-code",
		"label": "babbage-code-search-code"
	},
	{
		"value": "text-similarity-babbage-001",
		"label": "text-similarity-babbage-001"
	},
	{
		"value": "text-davinci-001",
		"label": "text-davinci-001"
	},
	{
		"value": "ada",
		"label": "ada"
	},
	{
		"value": "curie-instruct-beta",
		"label": "curie-instruct-beta"
	},
	{
		"value": "babbage-code-search-text",
		"label": "babbage-code-search-text"
	},
	{
		"value": "babbage-similarity",
		"label": "babbage-similarity"
	},
	{
		"value": "gpt-3.5-turbo",
		"label": "gpt-3.5-turbo"
	},
	{
		"value": "gpt-4",
		"label": "gpt-4"
	},
	{
		"value": "code-search-babbage-text-001",
		"label": "code-search-babbage-text-001"
	},
	{
		"value": "gpt-3.5-turbo-0301",
		"label": "gpt-3.5-turbo-0301"
	},
	{
		"value": "code-cushman-001",
		"label": "code-cushman-001"
	},
	{
		"value": "code-search-babbage-code-001",
		"label": "code-search-babbage-code-001"
	},
	{
		"value": "text-ada-001",
		"label": "text-ada-001"
	},
	{
		"value": "text-embedding-ada-002",
		"label": "text-embedding-ada-002"
	},
	{
		"value": "text-similarity-ada-001",
		"label": "text-similarity-ada-001"
	},
	{
		"value": "text-davinci-insert-002",
		"label": "text-davinci-insert-002"
	},
	{
		"value": "code-davinci-002",
		"label": "code-davinci-002"
	},
	{
		"value": "ada-code-search-code",
		"label": "ada-code-search-code"
	},
	{
		"value": "ada-similarity",
		"label": "ada-similarity"
	},
	{
		"value": "whisper-1",
		"label": "whisper-1"
	},
	{
		"value": "text-davinci-003",
		"label": "text-davinci-003"
	},
	{
		"value": "code-search-ada-text-001",
		"label": "code-search-ada-text-001"
	},
	{
		"value": "text-search-ada-query-001",
		"label": "text-search-ada-query-001"
	},
	{
		"value": "text-curie-001",
		"label": "text-curie-001"
	},
	{
		"value": "text-davinci-edit-001",
		"label": "text-davinci-edit-001"
	},
	{
		"value": "davinci-search-document",
		"label": "davinci-search-document"
	},
	{
		"value": "ada-code-search-text",
		"label": "ada-code-search-text"
	},
	{
		"value": "text-search-ada-doc-001",
		"label": "text-search-ada-doc-001"
	},
	{
		"value": "code-davinci-edit-001",
		"label": "code-davinci-edit-001"
	},
	{
		"value": "davinci-instruct-beta",
		"label": "davinci-instruct-beta"
	},
	{
		"value": "text-similarity-curie-001",
		"label": "text-similarity-curie-001"
	},
	{
		"value": "code-search-ada-code-001",
		"label": "code-search-ada-code-001"
	},
	{
		"value": "ada-search-query",
		"label": "ada-search-query"
	},
	{
		"value": "text-search-davinci-query-001",
		"label": "text-search-davinci-query-001"
	},
	{
		"value": "curie-search-query",
		"label": "curie-search-query"
	},
	{
		"value": "davinci-search-query",
		"label": "davinci-search-query"
	},
	{
		"value": "text-davinci-insert-001",
		"label": "text-davinci-insert-001"
	},
	{
		"value": "babbage-search-document",
		"label": "babbage-search-document"
	},
	{
		"value": "ada-search-document",
		"label": "ada-search-document"
	},
	{
		"value": "text-search-curie-query-001",
		"label": "text-search-curie-query-001"
	},
	{
		"value": "text-search-babbage-doc-001",
		"label": "text-search-babbage-doc-001"
	},
	{
		"value": "text-davinci-002",
		"label": "text-davinci-002"
	},
	{
		"value": "curie-search-document",
		"label": "curie-search-document"
	},
	{
		"value": "text-search-curie-doc-001",
		"label": "text-search-curie-doc-001"
	},
	{
		"value": "babbage-search-query",
		"label": "babbage-search-query"
	},
	{
		"value": "text-babbage-001",
		"label": "text-babbage-001"
	},
	{
		"value": "text-search-davinci-doc-001",
		"label": "text-search-davinci-doc-001"
	},
	{
		"value": "text-search-babbage-query-001",
		"label": "text-search-babbage-query-001"
	},
	{
		"value": "curie-similarity",
		"label": "curie-similarity"
	},
	{
		"value": "curie",
		"label": "curie"
	},
	{
		"value": "text-similarity-davinci-001",
		"label": "text-similarity-davinci-001"
	},
	{
		"value": "davinci-similarity",
		"label": "davinci-similarity"
	},
	{
		"value": "cushman:2020-05-03",
		"label": "cushman:2020-05-03"
	},
	{
		"value": "ada:2020-05-03",
		"label": "ada:2020-05-03"
	},
	{
		"value": "babbage:2020-05-03",
		"label": "babbage:2020-05-03"
	},
	{
		"value": "curie:2020-05-03",
		"label": "curie:2020-05-03"
	},
	{
		"value": "davinci:2020-05-03",
		"label": "davinci:2020-05-03"
	},
	{
		"value": "if-davinci-v2",
		"label": "if-davinci-v2"
	},
	{
		"value": "if-curie-v2",
		"label": "if-curie-v2"
	},
	{
		"value": "if-davinci:3.0.0",
		"label": "if-davinci:3.0.0"
	},
	{
		"value": "davinci-if:3.0.0",
		"label": "davinci-if:3.0.0"
	},
	{
		"value": "davinci-instruct-beta:2.0.0",
		"label": "davinci-instruct-beta:2.0.0"
	},
	{
		"value": "text-ada:001",
		"label": "text-ada:001"
	},
	{
		"value": "text-davinci:001",
		"label": "text-davinci:001"
	},
	{
		"value": "text-curie:001",
		"label": "text-curie:001"
	},
	{
		"value": "text-babbage:001",
		"label": "text-babbage:001"
	}
]

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const openai = initOpenAI(null);

	// const models = await openai.listModels().then((res) => res.data.data);

	// const modelOptions = models.map((model) => ({
	//   value: model.id,
	//   label: model.id,
	// }));


	res.status(200).json({ modelOptions });
}
