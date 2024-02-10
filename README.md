Questmind.AI (Seneca) is a retrieval-augmented-generation AI chatbot.

The model uses Langchain for the RAG pipeline and is adapted to be deployed on Modal.com

The backend is built on NestJS and uses MongoDB.

The frontend is built in React and Ant Design.

The folder structure is pretty self-explanatory.

The frontend and the backend are dockerized, and the backend is communicating with the RAG script, which is supposed to be deployed on Modal.com.

To deploy locally:

You'll have to deploy the RAG script on modal.com anyway. Add OPENAI_API_KEY to modelfolder .env.

modal run && modal deploy

Add this to .env in modal folder:

API_ENDPOINT=rag_script_deployed_on_modal.com_enpoint
MDB_URI=mongodb_uri
JWT_SECRET=pretty_self_explanatory
SENDGRID_API_KEY=for_restore_passwords_emails
GOOGLE_CLIENT_SECRET=for_google_auth
GOOGLE_CLIENT_ID=also_for_google_auth

You can also define a number of CURRENT_DEPLOYMENT addresses to switch between local, staging, and production deployments.

Notice that at the moment, portions of docker-compose.yml related to the frontend are commented out. So when running locally, use:

docker compose up -d

for the backend and:

yarn && yarn run

...for the frontend. 

.env in the frontend should include these variables:

REACT_APP_API_URL=https://www.your_deployment.ai/api
REACT_APP_SOCKET_URL=https://www.your_deployment.ai
REACT_APP_CURRENT_DEPLOYMENT=https://www.your_deployment.ai

To deploy on production remove comments from docker-compose.yml. My deployment was done on Digital Ocean. 

For any questions feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/igorchesnokov/)
 or on [X](https://twitter.com/prax81).



