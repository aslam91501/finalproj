import PocketBase from 'pocketbase';
import { pburl } from './vars';

const pb = new PocketBase(pburl);

export default pb;