import { useState } from "react";
import { Upload } from "lucide-react";
import { api } from "@/HTTP/api";
import { Button } from "@/components/ui";
import { Message } from "@/components/ui/Message";

export default ({ onUploaded }) => {
	const [hover, setHover] = useState( false );
	const [files, setFiles] = useState( [] );

	const onDrop = ( e ) => {
		e.preventDefault();
		const list = Array.from( e.dataTransfer.files || [] );
		setFiles( list );
		setHover( false );
	};
	const onChange = async ( e ) => {
		console.log( "onChange" );
		// curl -X POST http://localhost:5000/upload-files \
		// 	-F "files=@/path/to/document1.pdf" \
		// 	-F "files=@/path/to/document2.txt"
		const fileList = Array.from( e.target.files || [] );
		const res = await api.uploadFiles( fileList );
		if( res.status == 'success' ) {
			Message.success( '文件上传成功!' );
			onUploaded( res.uploaded_files );
		}
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
				<span>上传</span>
				<input
					type="file"
					multiple
					className="sr-only"
					accept="text/markdown,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/csv,application/json,application/xml,text/html"
					onChange={ onChange }
				/>
				{/* <span onClick={ () => { Message.warning('文件上传暂不适用'); } }>上传</span> */}
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