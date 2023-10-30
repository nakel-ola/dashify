import { stackMiddlewares } from './middlewares/stack-middlewares';
import { withAuthorization } from './middlewares/with-authorization';

export default stackMiddlewares([withAuthorization]);
