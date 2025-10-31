import { useState } from "react";
import { Upload } from "lucide-react";
import { api } from "@/HTTP/api";
import { Button } from "@/components/ui";

export default () => {
	const [hover, setHover] = useState( false );
	const [files, setFiles] = useState( [] );

	const onDrop = ( e ) => {
		e.preventDefault();
		const list = Array.from( e.dataTransfer.files || [] );
		setFiles( list );
		setHover( false );
	};
	const onChange = async ( e ) => {
		// const res = await api.uploadFiles( e.target.files );
		// if( res.status == 'success' ) {
		// 	// setFiles( res.data );
		// 	console.log( res );
		// }
	};

	return (
		<div>
			<label
				onDragOver={ ( e ) => {
					e.preventDefault();
					setHover( true );
				} }
				onDragLeave={ () => setHover( false ) }
				onDrop={ onDrop }
				className={ `block cursor-pointer rounded-md border px-2 py-1 text-xs dark:border-neutral-800 flex items-center gap-2 ${ hover ? "bg-neutral-50 dark:bg-neutral-900" : ""
					}` }
			>
				<Upload size={16} />
				{/* <span>上传</span> */}
				{/* <input
					type="file"
					multiple
					className="sr-only"
					accept="text/markdown,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/csv,application/json,application/xml,text/html"
					onChange={ onChange }
				/> */}
				<span onClick={ () => { Message.warning('文件上传暂不适用'); } }>上传</span>
			</label>
			{ files.length > 0 && (
				<ul className="mt-2 space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
					{ files.map( ( f ) => (
						<li key={ f.name } className="truncate">{ f.name }</li>
					) ) }
				</ul>
			) }
		</div>
	);
}