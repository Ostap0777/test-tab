const jsonData = {
	"tab": [
	  { "id": "0", "name": "Dashboard", "img": "/img/01 align center.svg" },
	  { "id": "1", "name": "Banking", "img": "/img/fi-rs-bank (1).svg" },
	  { "id": "2", "name": "Telefonie", "img": "/img/fi-rs-phone-call (1).svg" },
	  { "id": "3", "name": "Accounting", "img": "/img/fi-rs-user-add (1).svg" },
	  { "id": "4", "name": "Verkauf", "img": "/img/fi-rs-shop (2).svg" },
	  { "id": "5", "name": "Statistik", "img": "/img/fi-rs-bank (2).svg" },
	  { "id": "6", "name": "Post Office", "img": "/img/fi-rs-bank (2).svg" },
	  { "id": "7", "name": "Administration", "img": "/img/fi-rs-settings (1).svg" },
	  { "id": "8", "name": "Help", "img": "/img/fi-rs-book-alt (1).svg" },
	  { "id": "9", "name": "Warenbestand", "img": "/img/fi-rs-cube (1).svg" },
	  { "id": "10", "name": "Auswahllisten", "img": "/img/fi-rs-list (1).svg" },
	  { "id": "11", "name": "Einkauf", "img": "/img/fi-rs-shopping-cart-check (1).svg" },
	  { "id": "12", "name": "Rechn", "img": "/img/fi-rs-browser (1).svg" }
	]
 };
 
 export const saveTabsToLocalStorage = (
	pinnedTabs = [],
	overflowTabs = [],
	otherTabs = []
) => {

	const defaultOtherTabs = otherTabs.length > 0 ? otherTabs : jsonData.tab.filter(tab => !pinnedTabs.some(pinnedTab => pinnedTab.id === tab.id) && !overflowTabs.some(overflowTab => overflowTab.id === tab.id));

	const data = {
	  pinnedTabs: pinnedTabs.length > 0 ? pinnedTabs : [],
	  overflowTabs: overflowTabs.length > 0 ? overflowTabs : [],
	  otherTabs: defaultOtherTabs,
	};
 
	localStorage.setItem('tabs', JSON.stringify(data));
};
