// @flow

/*::
import Template from './Template.js';

type MenuTree = {id: string, children?: Array<MenuTree>};

export default
*/
class Menu {
/*::
   static MARGIN: number;
 */
   static init() {
      Menu.MARGIN = 4;
   }      

   static addMenus($menus /*: JQuery */, location /*: eventLocation */) {
      // remove all other menus
      const $parent = $menus.first().parent();
      $menus.detach();
      $('.menu').remove();  // be careful -- this may not always be appropriate
      $parent.append($menus);

      // only consider non-empty menus
      const $non_empty_menus = $menus.filter('ul.menu').filter( (_,ul) => ul.childElementCount != 0 );

      // set click handler for each menu
      $non_empty_menus.each( (_inx, ul) => ul.addEventListener('click', Menu.actionClickHandler) );

      const menu_tree = Menu._getMenuTree($non_empty_menus);
      Menu.setMenuTreeLocation(menu_tree, location);

      $(`#${menu_tree.id}`).css('visibility', 'visible');
   }

   static _getMenuTree($menus /*: JQuery */) /*: MenuTree */ {
      // find top menu:
      //    within each menu find each link and remove it from the set of potential targets
      //    the last man standing is the one with no links to it, the top menu
      const targets = new Set/*:: <string> */($menus.map( (_inx, ul) => ul.id ).toArray() );
      $menus.each( (_inx, menu) => {
         $(menu).find('li[link]').each( (_inx, li) => {
            const link = li.getAttribute('link');
            if (link != undefined) {
               targets.delete(link);
            }
         } )
      } );

      const top_menu_id = Array.from(targets)[0];

      // recursive routine to get menu tree for this menu
      const getMenuTreeFromID = (menu_id /*: string */) /* MenuTree */ => {
         const children = [];
         $menus.filter(`[id="${menu_id}"]`)
            .find('li[link]')
            .each( (_inx, li) => {
               const link = li.getAttribute('link');
               if (link != undefined) {
                  children.push(getMenuTreeFromID(link));
               }
            } );
         return {id: menu_id, children: children};
      }

      // find menu tree for top menu
      const result = getMenuTreeFromID(top_menu_id);
      return result;
   }

   static setMenuTreeLocation(menu_tree /*: MenuTree */, location /*: eventLocation */) {
      const $menu = $(`#${menu_tree.id}`);
      const {clientX, clientY} = Menu.setMenuLocation($menu, location); 
         
      // fit child menus
      //   put child on right if it fits, left if it doesn't
      //   recursively descend tree to fit each child menu
      const menu_box = $menu[0].getBoundingClientRect();
      const body_box = $('body')[0].getBoundingClientRect();
      if (menu_tree.children != undefined) {
         menu_tree.children.forEach( (child) => {
            const $link = $menu.find(`> [link=${child.id}]`);
            const link_box = $link[0].getBoundingClientRect();
            const child_box = $(`#${child.id}`)[0].getBoundingClientRect();
            const childX = (clientX + menu_box.width + child_box.width > body_box.right - Menu.MARGIN)
                  ? clientX - child_box.width
                  : clientX + menu_box.width;
            const childY = link_box.top;
            Menu.setMenuTreeLocation(child, {clientX: childX, clientY: childY})
         } )
      }
   }

   static setMenuLocation($menu /*: JQuery */, location /*: eventLocation */) /*: eventLocation */ {
      // set upper left corner of menu to base
      const menu_box = $menu[0].getBoundingClientRect();
      const body_box = $('body')[0].getBoundingClientRect();

      let {clientX, clientY} = location;

      // if it doesn't fit on the right push it to the left enough to fit
      if (clientX + menu_box.width > body_box.right - Menu.MARGIN)
         clientX = body_box.right - Menu.MARGIN - menu_box.width;
      
      // if it doesn't fit on the bottom push it up until it bumps into the top of the frame
      if (clientY + menu_box.height > body_box.bottom - Menu.MARGIN)
         clientY = body_box.bottom - Menu.MARGIN - menu_box.height
      if (clientY < body_box.top + Menu.MARGIN) {
         clientY = body_box.top + Menu.MARGIN;
         $menu.css('height', body_box.bottom - body_box.top - 2*Menu.MARGIN)  // fix margin, padding here?
              .css('overflow-y', 'scroll');
      }

      $menu.css('left', clientX)
           .css('top', clientY);
         
      return {clientX: clientX, clientY: clientY};
   }

   static actionClickHandler(event /*: MouseEvent */) {
      event.preventDefault();
      const $action = $(event.target).closest('[action]');
      if ($action.length != 0) {
         event.stopPropagation();
         eval($action.attr('action'));
         // if we've just executed a menu action that's not just exposing a sub-menu then we're done: remove the menu
         if ($action.parent().hasClass('menu') && $action.attr('link') == undefined) {
            $action.parent().parent().find('.menu').remove();
         }
      }
   }

   /* FIXME hovering
    *   if sub-menu is hidden, hide any other visible sub-menus and expose this sub-menu [and disable hover exposure of sub-menus]
    *   if sub-menu is already visible, hide it [and enable hover sub-menu exposure]
    */
   static pinMenu(event /*: MouseEvent */) {
      // find sub-menus exposed by this menu and hide them
      const hideSubMenus = ($list /*: JQuery */) => {
         $list.each( (_, el) => {
            const link = el.getAttribute('link');
            if (link != undefined) {
               const $target = $(`#${link}`);
               if ($target.css('visibility') == 'visible') {
                  $target.css('visibility', 'hidden');
                  hideSubMenus($target.children());
               }
            }
         } );
      };

      const $action = $(event.target).closest('[action]');
      const $element = $(`#${$action.attr('link')}`);
      const element_was_hidden = $element.css('visibility') == 'hidden';
      hideSubMenus($action.parent().children());
      if (element_was_hidden) {
         $element.css('visibility', 'visible');
      } else {
         $element.css('visibility', 'hidden');
      }
   }

   // Makes menu-submenu link from template in visualizerFramework/visualizer.html
   static makeLink(label /*: string */, link /*: string */) /*: html */ {
      return eval(Template.HTML('link-template'));
   }
}

Menu.init();
