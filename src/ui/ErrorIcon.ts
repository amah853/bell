import * as m from 'mithril'

export default {
  view (vnode: m.Vnode<{}>) {
    return m('.centered.error-page', [
      m('i.material-icons.error-icon', 'error_outline'),
      m('.error-content', vnode.children)
    ])
  }
} as m.Component<{}, {}>
