
import type { GetContainer } from './interface'
import canUseDom from '../util/Dom/canUseDom';

export const getPortalContainer = (getContainer?: GetContainer) => {
  if (getContainer === false) {
    return false;
  }

  if (!canUseDom() || !getContainer) {
    return null;
  }

  if (typeof getContainer === "string") {
    return document.querySelector(getContainer);
  }
  if (typeof getContainer === "function") {
    return getContainer();
  }
  return getContainer;
};

export const createEle = (debug?: string) => {
  if (!canUseDom()) {
    return null;
  }

  const defaultEle = document.createElement('div');

  if (process.env.NODE_ENV !== 'production' && debug) {
    defaultEle.setAttribute('data-debug', debug)
  }

  return defaultEle;
}
