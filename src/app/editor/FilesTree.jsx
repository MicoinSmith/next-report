import { useMemo, useState, useEffect } from "react";
import { FileText, MenuIcon, EllipsisVertical, Trash2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import UploadInput from "./UploadInput";
import { api } from "@/HTTP/api";
import { format } from "date-fns";
import { DropdownMenu, Button } from "@/components/ui";

function TreeNode( { node, expanded, onToggle, onSelect, level } ) {
  const isFolder = node.type === "folder";
  const isOpen = expanded.has( node.id );
  const leftPad = 8 + level * 12;
  return (
    <li>
      <div
        className="flex items-center gap-2 rounded px-1 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
        style={ { paddingLeft: leftPad } }
        onClick={ ( e ) => {
          e.stopPropagation();
          if ( isFolder ) onToggle( node.id ); else onSelect( node );
        } }
        onDoubleClick={ () => onSelect( node ) }
      >
        <Chevron open={ isOpen } hidden={ !isFolder } />
        <TypeIcon type={ node.type } open={ isOpen } />
        <span className="truncate">{ node.name }</span>
      </div>
      { isFolder && isOpen && node.children && node.children.length > 0 && (
        <ul className="mt-1 space-y-1">
          { node.children.map( ( c ) => (
            <TreeNode key={ c.id } node={ c } expanded={ expanded } onToggle={ onToggle } onSelect={ onSelect } level={ level + 1 } />
          ) ) }
        </ul>
      ) }
    </li>
  );
}

function Chevron( { open, hidden } ) {
  if ( hidden ) return <span className="w-3" />;
  return (
    <svg className={ `w-3 h-3 transition-transform ${ open ? "rotate-90" : "rotate-0" }` } viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function TypeIcon( { type, open } ) {
  if ( type === "folder" ) {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4l2 2h8a2 2 0 012 2v1H2V6a2 2 0 012-2h6z" opacity=".6" />
        <path d="M2 9h20v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" opacity=".85" />
    </svg>
  );
}


export default function FilesTree( { tree = [], onSelect, updateFilesList } ) {
  const { theme, setTheme } = useTheme(); // 现在可以访问主题，用于将来扩展功能
  const [filesList, setFilesList] = useState( [] );

  useEffect( () => {
    fetchFiles();
  }, [] );

  const fetchFiles = async () => {
    const res = await api.listFiles( {} );
    if ( res.status == 'success' ) {
      setFilesList( res.files );
      updateFilesList( res.files );
    }
  }

  const getFileSize = ( size ) => {
    if ( size < 1024 ) {
      return size + ' B';
    } else if ( size < 1024 * 1024 ) {
      return ( size / 1024 ).toFixed( 2 ) + ' KB';
    } else {
      return ( size / 1024 / 1024 ).toFixed( 2 ) + ' MB';
    }
  }

  const toggle = ( id ) => {
    setExpanded( ( prev ) => {
      const next = new Set( prev );
      if ( next.has( id ) ) next.delete( id ); else next.add( id );
      return next;
    } );
  };

  const handleSelect = ( node ) => {
    if ( onSelect ) onSelect( node );
  };

  const handleUploaded = ( files ) => {
    fetchFiles();
  };

  const handleDelete = async ( id ) => {
    Message.confirm( '确定删除该文件吗?', '删除文件', {
      type: 'danger',
      title: '删除文件',
      content: '确定删除该文件吗?',
      onCancel: () => {
        console.log( '取消删除' );
      },
      onOk: async () => {
        const res = await api.deleteFile( id );
        if ( res.status == 'success' ) {
          fetchFiles();
        }
      }
    } );
  };

  return (
    <div className="text-sm select-none">
      <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-neutral-800">
        <p>文件总数: { filesList.length }</p>
        <UploadInput onUploaded={ handleUploaded } />
      </div>
      { filesList.length === 0 ? (
        <div className="text-neutral-500 text-center py-4">暂无文件</div>
      ) : (
        <ul className="space-y-1 p-2">
          { filesList.map( ( n ) => (
            <div className="px-2 flex items-center justify-between gap-2 rounded px-1 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer" key={ n.id }>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <FileText size={ 16 } className="text-neutral-200" />
                  <span className="truncate max-w-[120px]" title={ n.filename }>{ n.filename }</span>
                </div>
                <span className="text-neutral-500 text-xs">{ format( new Date( n.created_at ), 'yyyy-MM-dd HH:mm:ss' ) }</span>
              </div>
              <div className="flex flex-col items-end gap-2">
                {/* <DropdownMenu size="sm">
                  <DropdownMenu.Trigger className="focus:outline-none focus-visible:outline-none">
                    <EllipsisVertical size={ 12 } className="text-neutral-200" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="w-20 !min-w-20">
                    <DropdownMenu.Item className="!px-0.5 !py-0 text-red-500 flex items-center justify-center gap-2">删除</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu> */}
                <Trash2 size={ 14 } className="text-neutral-200 cursor-pointer hover:text-red-500 animate duration-100" onClick={ () => handleDelete( n.id ) } />
                <span className="text-neutral-500 text-xs">{ getFileSize( n.size ) }</span>
              </div>
            </div>
          ) ) }
        </ul>
      ) }
    </div>
  );
}