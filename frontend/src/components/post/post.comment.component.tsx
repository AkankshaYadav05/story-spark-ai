import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateCommentMutation,
  useGetCommentsListQuery,
} from "../../redux/apis/comment";
import { isLoggedIn } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import SSProfile from "../ui-component/ss-profile/ss-profile";
import { timeAgo } from "../../utils/time-formate";
import { getErrorMessage } from "../../error/error.message";

type Inputs = {
  comment: string;
};

interface IPostCommentComponentProps {
  postId: string;
}

const PostCommentComponent: React.FC<IPostCommentComponentProps> = ({
  postId,
}) => {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const isLogin = isLoggedIn();

  const { data: commentList } = useGetCommentsListQuery(postId);
  const [createComment] = useCreateCommentMutation();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!isLogin) {
      toast.error("Please login to post a comment.");
      return;
    }
    if (data.comment === "") {
      toast.error("Please enter a comment. at last 5 words...");
      return;
    }
    const createPostComment = {
      postId: postId,
      comment: data.comment,
    };
    setIsBusy(true);
    try {
      const res = await createComment({ ...createPostComment }).unwrap();
      if (res) {
        toast.success("Comment posted successfully!");
        reset();
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div>
      <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register("comment")}
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-slate-500 transition-all shadow-inner"
          rows={3}
          placeholder="Share your thoughts on this story..."
        ></textarea>
        <button
          type="submit"
          className={`!rounded-button mt-3 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md ${
            isBusy
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 active:scale-95 cursor-pointer"
          }`}
          disabled={isBusy}
        >
          {isBusy ? "Posting..." : "Post Comment"}
        </button>
      </form>
      <h3 className="text-2xl font-bold mb-8 text-slate-200 tracking-tight border-t border-slate-700/50 pt-8">
        Comments ({commentList?.totalComments})
      </h3>
      <div className="space-y-6">
        {commentList?.comments.map((comment) => (
          <div className="flex space-x-4">
            <SSProfile name={comment?.userId.name as string} size="w-10 h-10" />
            <div className="flex-1">
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 shadow-sm hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-400 text-lg">
                    {comment.userId.name}
                  </h4>
                  <span className="text-sm text-slate-500 font-medium">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed mt-2">{comment.comment}</p>
              </div>
              <div className="flex items-center mt-3 pl-2 space-x-4 text-sm text-slate-500 font-medium">
                <button className="hover:text-red-400 transition-colors flex items-center gap-1">
                  <i className="far fa-heart mr-1"></i> {comment.likes.length}
                </button>
                {/* <button className="hover:text-custom">
                  <i className="far fa-comment mr-1"></i> Reply
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default PostCommentComponent;
