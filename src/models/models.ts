export interface TabItems {
	id: string;
	name: string;
	img: string;
	isPinned: boolean;
 }
 
 export const ItemTypes = {
	TAB: 'TAB',
 };

 export interface Tab {
	id: string;
	name: string;
	img: string;
	isPinned: boolean;
 }
 
 export interface TabsListProps {
	tab: Tab;
	index: number;
	moveTab: (fromIndex: number, toIndex: number) => void;
	togglePinTab: (tabId: string) => void;
	tabs: Tab[];
 }