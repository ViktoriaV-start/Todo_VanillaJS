import { Todo } from '@models/Todo';
import '@/styles/index.scss';
import { header } from '@/components/Header';
import { Content } from "@/components/Content";
import {Form} from "@/components/Form";


document.querySelector('.header__wrap').insertAdjacentHTML('beforeend', header);
const content = new Content();
const form = new Form(content);
