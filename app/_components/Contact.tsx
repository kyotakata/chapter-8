"use client";

import {useState} from "react";

export const Contact = () =>{
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [loading, setLoading] = useState(false); 

  const [nameText,setNameText] = useState("");
  const [emailText,setEmailText] = useState("");
  const [messageText,setMessageText] = useState("");
  const onChangeNameText = (event:React.ChangeEvent<HTMLInputElement>) => setNameText(event.target.value);
  const onChangeEmailText = (event:React.ChangeEvent<HTMLInputElement>) => setEmailText(event.target.value);
  const onChangeMessageText = (event:React.ChangeEvent<HTMLTextAreaElement>) => setMessageText(event.target.value);

  const onSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();    // 画面リロードを防ぐ

    // リセット
    setNameError("");
    setEmailError("");
    setMessageError("");
    let hasError = false;

    if(nameText.trim() === ""){
      setNameError("お名前は必須です。");
      hasError = true;
    }
    if(nameText.length > 30){
      setNameError("名前は30文字以内にしてください。");
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^@]+\.[^@]+$/;// 空白と「@」以外のユーザー名で、ドメイン名「.」の前後は 空白と「@」以外で1文字以上。ユーザー名@ドメイン名の形であること。
    if(!emailRegex.test(emailText)){
      setEmailError("メールアドレスの形式が正しくありません。");
      hasError = true;
    }

    if(emailText.trim() === ""){
      setEmailError("メールアドレスは必須です。");
      hasError = true;
    }

    if(messageText.trim() === ""){
      setMessageError("本文は必須です。");
      hasError = true;
    }
    if(messageText.length > 500){
      setMessageError("本文は500文字以内にしてください。");
      hasError = true;
    }

    if(hasError) return;

    setLoading(true);
    try{
      const res = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nameText,
            email: emailText,
            message: messageText,
          }),
        }
      );
      console.log(res.status);
      if(res.ok){
        alert("送信しました");
        onClickClear();
      }else{
        alert(`送信失敗${res.status}`);
      }
    }catch(e){
      if(e instanceof Error){
        alert(`送信失敗${e.message}`);
      }else{
        alert(`送信失敗`);
      }
    }
    finally{
      setLoading(false);
    }
  };

  const onClickClear = () =>{
    setNameText("");
    setEmailText("");
    setMessageText("");
  };

  if(loading){
    return <div>送信中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-xl font-bold mb-10">問合わせフォーム</h1>
      <form onSubmit={onSubmit}>
        <div className="flex justify-between items-center mb-6">
          <label htmlFor="name" className="w-[240px]">お名前</label>
          <div className="w-full">
            <input name="name" id="name" type="text" className="border border-gray-300 rounded-lg p-4 w-full" value={nameText} onChange={onChangeNameText}/>
            {nameError && <p className="text-sm text-red-700">{nameError}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <label htmlFor="email" className="w-[240px]">メールアドレス</label>
          <div className="w-full">
            <input name="email" id="email" type="email" className="border border-gray-300 rounded-lg p-4 w-full" value={emailText} onChange={onChangeEmailText}/>
            {emailError && <p className="text-sm text-red-700">{emailError}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <label htmlFor="message" className="w-[240px]">本文</label>
          <div className="w-full">
            <textarea name="message" id="message" rows={8} className="w-full border border-gray-300 rounded-lg p-4" value={messageText} onChange={onChangeMessageText}/>
            {messageError && <p className="text-sm text-red-700">{messageError}</p>}
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button type="submit" className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4">送信</button>
          <button type="button" onClick={onClickClear} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">クリア</button>
        </div>
      </form>
    </div>
  );
};