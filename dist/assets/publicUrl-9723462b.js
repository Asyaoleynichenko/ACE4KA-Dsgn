function s(t){return t==null||typeof t!="string"||/^https?:\/\//i.test(t)||t.startsWith("data:")||t.startsWith("blob:")?t:`/${t.startsWith("/")?t.slice(1):t}`}export{s as p};
