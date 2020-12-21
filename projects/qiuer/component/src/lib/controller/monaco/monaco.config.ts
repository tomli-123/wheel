import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
// monaco编辑器的配置
export const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad: qscriptMonacoLoad
};

export function qscriptMonacoLoad() {
  (window as any).monaco.languages.register({ id: 'qscript' });

  // Register a tokens provider for the language
  (window as any).monaco.languages.setMonarchTokensProvider('qscript', {
    tokenPostfix: '.qscript',
    ignoreCase: false,
    defaultToken: 'invalid',
    keywords: [
      'run', 'set', 'return', 'import',
      'for', 'if', 'then', 'else', 'switch', 'case',
      'query', 'update', 'write', 'QUERY', 'UPDATE', 'WRITE', 'Query', 'Update', 'Write',
      'trace', 'print', 'try', 'validate'
    ],
    operators: [
      '<=', '>=', '==', '!=', '===', '!==', '=>', '+', '-', '**',
      '*', '/', '%', '++', '--', '<<', '</', '>>', '>>>', '&',
      '|', '^', '!', '~', '&&', '||', '?', ':', '=', '+=', '-=',
      '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=',
      '^=', '@',
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    tokenizer: {
      root: [
        [/[{\[\]}]/, 'delimiter.bracket'],
        { include: 'common' },
      ],
      common: [
        // identifiers and keywords
        [/[a-z_$][\w$]*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }],
        // whitespace
        { include: '@whitespace' },

        // delimiter: after number because of .\d floats
        [/[:,".]/, 'delimiter'],

        // delimiters and operators
        [/[()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'delimiter',
            '@default': ''
          }
        }],

        // numbers
        [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
        [/(@digits)/, 'number'],

        // strings
        [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
        // [/"/, 'string', '@string_double'], // 分隔符
        [/'/, 'string', '@string_single'],

      ],

      // string_double: [
      // 	[/[^\\"]+/, 'string'],
      // 	[/@escapes/, 'string.escape'],
      // 	[/\\./, 'string.escape.invalid'],
      // 	[/"/, 'string', '@pop']
      // ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop']
      ],


      bracketCounting: [
        [/\{/, 'delimiter.bracket', '@bracketCounting'],
        [/\}/, 'delimiter.bracket', '@pop'],
        { include: 'common' }
      ],

      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ],

      jsdoc: [
        [/[^\/*]+/, 'comment.doc'],
        [/\*\//, 'comment.doc', '@pop'],
        [/[\/*]/, 'comment.doc']
      ],
    }
  });

  // CompletionItemInsertTextRule.InsertAsSnippet 25
  (window as any).monaco.languages.registerCompletionItemProvider('qscript', {
    provideCompletionItems: (model, position) => {
      const suggestions: any = [
        {
          label: 'run',
          insertText: [
            '{run:"${1:method}", from:"${2:param}", to:"${3:result}", as:"${4:function}"},'
          ].join('\n'),
          documentation: '函数执行, as:inline|sub|function|thread'
        }, {
          label: 'set',
          insertText: [
            '{set:"${1:param}", "=":"${2:\\$context}"},'
          ].join('\n'),
          documentation: `
set var, =|+=|~=|&= val
a=xx             引用拷贝赋值。xx如果是LIST,MAP字面值或简单类型则强制为拷贝赋值{set:"a","=":{key:value}}，其他情况只是引用
a&xx             引用。就纯引用，只针对LIST,MAP字面值，其他时候效果同=
a~=xx            拷贝赋值
a:xx             强制字符串。后面只能是双引号包含的字符串

a=null           在a所在map中删除a
a[]=null         不支持。在LIST a中删除所有元素 by张倩20190210
a[n]=null        在LIST a中删除指定下标元素

a[]=xx           不支持。下标不能为空。如有必要可考虑兼容成a[]+=xx
a[n]=xx          设置下标n为xx，a.size小于n+1则扩展列表，扩展元素为null
a[]+=xx          不支持。xx整个对象追加到LIST a的末尾  by张倩20190210
a[n]+=xx         a[n]如果是LIST则在其尾部追加xx整个对象；a[n]如果是MAP则报错，MAP不允许追加；a[n]如果是字符串则拼接xx
a[]&=xx          不支持。a与xx合并。xx也必须是LIST  by张倩20190210
a[n]&=xx         a[n]如果是LIST且xx也是LIST则合并；a[n]如果是MAP且xx也是MAP则合并；a[n]如果是字符串则报错字符串不支持合并只支持追加

scope.a=xx       scope.put(a,xx)
scope.a+=xx      a如果是LIST则在其尾部加整个xx对象；a如果是MAP则报错，MAP不允许追加；a如果是字符串则拼接xx
scope.a&=xx      a如果是LIST且xx也是LIST则合并；a如果是MAP且xx也是MAP则合并；a如果是字符串则报错字符串不支持合并只支持追加
scope.['a']=xx   同scope.a=xx
scope.['a']+=xx  同scope.a+=xx
scope.['a']&=xx  同scope.a&=xx
`
        }, {
          label: 'set {}',
          insertText: [
            '{set:"${1:param}", "=":{}},'
          ].join('\n'),
          documentation: '声明变量'
        }, {
          label: 'set conn',
          insertText: [
            '{set:"${1:conn}", "=":"db.connect(${2:\'qiuer\'})"},'
          ].join('\n'),
          documentation: '声明变量'
        }, {
          label: 'set return $output',
          insertText: [
            '{set:"${1:\\$output}", "=":{code:0,${2:msg\:\"成功\"}${3:\,data\:\{\\}}}},',
            '',
            '',
            '{return:"${4:\\$output}"}'
          ].join('\n'),
          documentation: '声明和返回变量'
        }, {
          label: 'return',
          insertText: [
            '{return:"${1:\\$output}"}'
          ].join('\n'),
          documentation: '返回'
        }, {
          label: 'import',
          insertText: [
            '{import:["${1:task}"]},'
          ].join('\n'),
          documentation: '导入'
        }, {
          label: 'trace',
          insertText: [
            '{trace:"${1:\'str=%s\'}", from:["${2:param}"]},'
          ].join('\n'),
          documentation: '调试输出'
        }, {
          label: 'print',
          insertText: [
            '{print:"${1:\'str=%s\'}", from:["${2:param}"]},'
          ].join('\n'),
          documentation: '打印输出'
        }, {
          label: 'if',
          insertText: [
            '{if:"${1:condition}"${2:\ \,then:\[\n\t\n\]}${3:\ \,else:\[\n\t\n\]}},'
          ].join('\n'),
          documentation: 'IF判断'
        }, {
          label: 'if then',
          insertText: [
            '{if:"${1:condition}", then:[\n\t\n]},'
          ].join('\n'),
          documentation: 'IF THEN 判断'
        }, {
          label: 'for in',
          insertText: [
            '{for:["${1:index}","${2:item}"], in:"${3:list}", as:"${4:list}", loop:[',
            '\t',
            ']},'
          ].join('\n'),
          documentation: 'FOR循环'
        }, {
          label: 'for in object',
          insertText: [
            '{for:["${1:index}","${2:item}"], in:"${3:object}", as:"${4:\{\\}}", loop:[',
            '\t',
            ']},'
          ].join('\n'),
          documentation: 'FOR循环'
        }, {
          label: 'for from to ',
          insertText: [
            '{for:"${1:index}", from: "${2:begin}", to:"${3:end}"${4:\,\ step\:\"1\"}, loop:[',
            '\t',
            ']},'
          ].join('\n'),
          documentation: 'FOR循环'
        }, {
          label: 'while',
          insertText: [
            '{while:"${1:condition}", loop:[\n\t\n]},'
          ].join('\n'),
          documentation: 'WHILE循环'
        }, {
          label: 'do-while',
          insertText: [
            '{do-while:"${1:condition}", loop:[\n\t\n]},'
          ].join('\n'),
          documentation: 'DO-WHILE循环'
        }, {
          label: 'switch',
          insertText: [
            '{switch:"${1:param}", as:"${2:string}", case:{',
            '"${3:val1}":[\n\t\n]}, default:[\n\t\n]},'
          ].join('\n'),
          documentation: 'SWITCH跳转'
        }, {
          label: 'case',
          insertText: [
            ', "${1:val}":[\n\t\n]'
          ].join('\n'),
          documentation: 'CASE条件'
        }, {
          label: 'query',
          insertText: [
            '{query:"${1:sqlcode}", from:"${2:param}", to:"${3:data}", as:${4:\{\\}}, by:"${5:conn}"},'
          ].join('\n'),
          documentation: '查询'
        }, {
          label: 'query-sql',
          insertText: [
            '{query-sql:"${1:sql}", from:"${2:param}", to:"${3:data}", as:${4:\{\\}}, by:"${5:conn}"},'
          ].join('\n'),
          documentation: '查询'
        }, {
          label: 'update',
          insertText: [
            '{update:"${1:sqlcode}", from:"${2:param}", to:"${3:affect}", by:"${4:conn}"},'
          ].join('\n'),
          documentation: '更新'
        }, {
          label: 'update-sql',
          insertText: [
            '{update-sql:"${1:sql}", from:"${2:param}", to:"${3:affect}", by:"${4:conn}"},'
          ].join('\n'),
          documentation: '更新'
        }, {
          label: 'prepare',
          insertText: [
            '{prepare:"${1:sqlcode}", to:"${2:stmt}", by:"${3:conn}"},'
          ].join('\n'),
          documentation: '准备'
        }, {
          label: 'prepare-sql',
          insertText: [
            '{prepare-sql:"${1:sql}", to:"${2:stmt}", by:"${3:conn}"},'
          ].join('\n'),
          documentation: '准备'
        }, {
          label: 'batch',
          insertText: [
            '{batch:"${1:stmt}", from:"${2:param}", limit:"${3:limit}"},'
          ].join('\n'),
          documentation: '批量更行'
        }, {
          label: 'batch execute',
          insertText: [
            '{batch:"${1:stmt}", to:"${2:affect}", as:"execute"},'
          ].join('\n'),
          documentation: '批量提交'
        }, {
          label: 'sql',
          insertText: [
            '{sql:"${1:sqlid}", from:"${2:sqlmap}", to:"sql"},'
          ].join('\n'),
          documentation: 'SQL对象'
        }, {
          label: 'sentence',
          insertText: [
            '{sentence:""/*Q$={',
            '${1:sentence}',
            '}=Q$*/, result:"${2:SET}", param:[',
            '\t',
            ']}'
          ].join('\n'),
          documentation: 'SQL语句'
        }, {
          label: 'param',
          insertText: [
            '{name:"${1:name}", type:"${2:STRING}", value:"${1:name}"${3:\ ,nullable:"Y"}},'
          ].join('\n'),
          documentation: `SQL参数
参数类型 STRING|INTEGER|BOOLEAN|DECIMAL`
        }, {
          label: 'query sentence',
          insertText: [
            '{query:{sentence:""/*Q$={',
            '${1:SELECT}',
            '}=Q$*/, result:"${2:SET}", param:[',
            '\t',
            ']}, from:"${3:param}", to:"${4:data}", as:${5:\{\\}}, by:"${6:conn}"},'
          ].join('\n'),
          documentation: '查询语句'
        }, {
          label: 'update sentence',
          insertText: [
            '{update:{sentence:""/*Q$={',
            '${1:UPDATE}',
            '}=Q$*/, param:[',
            '\t',
            ']}, from:"${2:param}", to:"${3:affect}", by:"${4:conn}"},'
          ].join('\n'),
          documentation: '更新语句'
        }, {
          label: 'prepare sentence',
          insertText: [
            '{prepare:{sentence:""/*Q$={',
            '${1:UPDATE}',
            '}=Q$*/, param:[',
            '\t',
            ']}, to:"${2:stmt}", by:"${3:conn}"},'
          ].join('\n'),
          documentation: '准备语句'
        }, {
          label: 'try',
          insertText: [
            '{try:[\n\t\n], on:[\n\t\n]},'
          ].join('\n'),
          documentation: 'TRY'
        }, {
          label: 'treeof',
          insertText: [
            '{set:"${1:list1}", "&=":"${2:list2}"},',
            '{set:"opt","=":["id","pid","nodes"]},',
            '{set:"map","=":"map.treeOf(${1:list1},opt)"},'
          ].join('\n'),
          documentation: 'treeof'
        }, {
          label: 'validate',
          insertText: [
            '{validate:["\\$context.id"],msg:["\'ID字段\'"],as:"required"},'
          ].join('\n'),
          documentation: 'validate'
        }, {
          label: 'http',
          insertText: [
            '{http:"\'${1:/fpcode.do}\'",from:"param",to:"out",by:"cli"},'
          ].join('\n'),
          documentation: 'http'
        }, {
          label: 'multiline',
          insertText: [
            '""/*Q$={\n\t\n}=Q$*/'
          ].join('\n'),
          documentation: 'multiline'
        }, {
          label: 'set multiline',
          insertText: [
            '{set:"param", ":":""/*Q$={\n\t\n}=Q$*/},'
          ].join('\n'),
          documentation: 'multiline'
        }, {
          label: 'write',
          insertText: [
            '{write:"${1:sectionId}",each:"${2:item}",in:"${3:data}",from:"${4:param}",as:{},by:"${5:stream}"},'
          ].join('\n'),
          documentation: 'write'
        }, {
          label: 'write section',
          insertText: [
            '{write-section:"${1:param}",from:"${2:data}",by:"${3:stream}"},'
          ].join('\n'),
          documentation: 'write section'
        }, {
          label: 'write txt',
          insertText: [
            '{write:{format:"txt",content:"${1:data}"cell:[\n\t{key:"${2:key}",value:"${3:value}",align:null,width:null,scale:null}\n]},each:"${4:item}",in:"${5:data}",as:{},limit:null,by:"${6:stream}"},'
          ].join('\n'),
          documentation: 'write txt'
        }, {
          label: 'write xlsx',
          insertText: [
            '{write:{format:"xlsx",sheetindex:"${1:index}",sheetname:"${2:name}",style:"\'${3:styleId}\'",cell:[\n\t{ref:"${4:ColumnNum}",value:"${5:value}",width:null,type:"${6:string}",height:null,style:"\'${7:styleId}\'"}\n]},each:"${8:item}",in:"${9:data}",as:{},limit:null,by:"${10:stream}"},'
          ].join('\n'),
          documentation: 'write xlsx'
        }, {
          label: 'write csv',
          insertText: [
            '{write:{format:"csv",cell:[\n\t{name:"${1:name}",value:"${2:value}"}\n]},each:"${3:item}",in:"${4:data}",as:{},limit:null,by:"${5:stream}"},'
          ].join('\n'),
          documentation: 'write csv'
        }, {
          label: 'read excel',
          insertText: [
            '{read:{format:"excel",field:[\n\t{ref:"${1:ColumnNum}",value:"${2:value}",type:"${3:string}"}\n]},from:"${4:row}",to:"${5:item}",as:{}},'
          ].join('\n'),
          documentation: 'read excel'
        }, {
          label: 'read csv',
          insertText: [
            '{read:{format:"csv",field:[\n\t{value:"${1:value}",type:"${2:string}"}\n]},from:"${3:row}",to:"${4:item}",as:{}},'
          ].join('\n'),
          documentation: 'read csv'
        }, {
          label: 'read regex',
          insertText: [
            '{read:{format:"regex",regex:"${1:regular}",field:[\n\t{value:"${2:value}",type:"${3:string}"}\n]},from:"${4:row}",to:"${5:item}",as:{}},'
          ].join('\n'),
          documentation: 'read regex'
        }, {
          label: 'read fixed',
          insertText: [
            '{read:{format:"regex",regex:"${1:regular}",field:[\n\t{value:"${2:value}",type:"${3:string}"}\n]},from:"${4:row}",to:"${5:item}",as:{}},'
          ].join('\n'),
          documentation: 'read fixed'
        }, {
          label: 'jump continue',
          insertText: [
            '{jump:"continue"},'
          ].join('\n'),
          documentation: 'jump continue'
        }, {
          label: 'jump break',
          insertText: [
            '{jump:"break"},'
          ].join('\n'),
          documentation: 'jump break'
        }
      ];
      suggestions.forEach((sugg) => {
        sugg['kind'] = (window as any).monaco.languages.CompletionItemKind.Class;
        sugg['insertTextRules'] = (window as any).monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
      });
      // inner function
      const functions = [
        ['boolean', '(${1:value})', '将值的类型转为 boolean，除了 nil 和 false，其他都值都将转为布尔值 true。'],
        ['buffer.html', '', 'html文件操作，在内存中完成操作，不需要生成实体文件'],
        ['buffer.txt', '', 'txt文件操作，在内存中完成操作，不需要生成实体文件'],
        ['count', '(${1:seq})', '返回集合元素个数'],
        ['date_to_string', '(${1:date},${2:format})', '将Date对象转化化特定格式的字符串'],

        ['double', '(${1:value})', '将值的类型转为 double'],
        // 资源
        ['db.connect', '(${1:conname},{2:datasource})', '设置数据库连接'],
        ['http.get', '(${1:sso})', '创建http.post请求'],
        ['http.post', '(${1:wxapi})', '创建http.get请求'],

        ['file.dbf', '(${1:filename},${2:r|wrw},${utf-8|gbk})', 'dbf文件操作\n file以//开头，是绝对路径，路径从app开始计\n 不以//开头，是相对路径，路径从temp开始计'],
        ['file.html', '(${1:filename},${2:r|wrw},${utf-8|gbk})', 'html文件操作\n file以//开头，是绝对路径，路径从app开始计\n 不以//开头，是相对路径，路径从temp开始计'],
        ['file.txt', '(${1:filename},${2:r|wrw},${utf-8|gbk})', 'txt文件操作\n file以//开头，是绝对路径，路径从app开始计\n 不以//开头，是相对路径，路径从temp开始计'],
        ['file.xlsx', '(${1:filename},${2:r|wrw},${utf-8|gbk})', 'xlsx文件操作\n file以//开头，是绝对路径，路径从app开始计\n 不以//开头，是相对路径，路径从temp开始计'],


        ['istream.valueOf', '()'],
        ['istream.toString', '()'],
        ['istream.nextRow', '(${1:stream})'],
        ['istream.excel.sheet', '(${1:stream},${1:index},${1:name})'],
        ['istream.excel.sheetname', '(${1:stream})'],
        ['istream.csv.headers', '(${1:stream})'],
        ['istream.dbf.info', '()'],


        ['filter', '(${1:collect},${2:predicate})', '将方法predicate作用在集合collect的每个元素上,返回结果为 true 的元素组成的集合'],

        ['fnpoint.access', '(${1:userid},${2:access})', '判断用户是否有权限'],
        ['fnpoint.getByCode', '(${1:code})', '通过Code获取方法'],
        ['fnpoint.getById', '(${1:funcId},${2:methId})', '通过Id获取方法'],
        ['fnpoint.parseId', '(${1:fpid})', '拆分fpid'],



        ['identity', '(${1:value})', '声明,返回参数value自身，用于跟seq库的高阶函数配合使用。'],
        ['include', '(${1:seq},${2:element})', '判断element是否在集合seq中,返回boolean值； 仅对数组和List有效'],

        ['json.toString', '(${1:json})', '同str()，将对象转换成字符串格式'],
        ['json.valueOf', '(${1:map})', 'map转成json'],

        ['list.toString', '(${1:list})', '同str()，将对象转换成字符串格式'],
        ['list.valueOf', '(${1:string})', '字符串转成list，参数是list格式的字符串'],
        ['list.size', '(${1:list})', 'list长度'],
        ['list.add', '(${1:list},${2:index},${3:e})', '向list添加元素'],
        ['list.sublist', '(${1:list},${2:from},${3:[to]})', '返回list中的一部分的视图'],
        ['list.reverse', '(${1:list})', '颠倒list的顺序'],
        ['list.sort', '(${1:func},${2:list})', '对list排序'],
        ['list.intersect', '(${1:func},${2:listA},${3:listB})', '返回交集数组'],
        ['list.indexOf', '(${1:func},${2:listA},${3:e})', '返回指定元素首次出现位置'],
        ['list.distinct', '(${1:func},${2:list})'],
        ['list.union', '(${1:func},${2:listA},${2:listB})'],
        ['list.range', '(${1:func},${2:begin},${2:end})'],


        ['map', '(${1:seq},${2:func})', '将函数 fun 作用到集合 seq 每个元素上, 返回新元素组成的集合'],
        ['map.concurrentMap', '()', '声明线程安全的map'],
        ['map.contains', '(${1:map},${2:value})', '判断map是否包含某个value'],
        ['map.get', '(${1:key})', '通过key获取value'],
        ['map.size', '()', '获取map的长度'],
        ['map.toString', '(${1:map})', '同str()，将对象转换成字符串格式'],
        ['map.treeOf', '(${1:list},${2:opt})', '生成树形式的map'],
        ['map.valueOf', '(${1:string})', '字符串转map'],


        ['long', '(${1:value})', '将值的类型转为 long'],
        ['mail.connect', '(${1:host},${2:port},${3:username},${4:password},${5:debug})', '设置mail连接，参考1100.71 msg.mailgw.mail2gateway。'],

        ['math.abs', '(${1:value})', '求 value 的绝对值'],
        ['math.cos', '(${1:value})', '余弦函数'],
        ['math.log', '(${1:value})', '求value的自然对数'],
        ['math.log10', '(${1:value})', '求value以10为底的对数'],
        ['math.pow', '(${1:value1},${2:value2})', '求value1的value2次方'],
        ['math.sin', '(${1:value})', '正弦函数'],
        ['math.sqrt', '(${1:value})', '求 value 的平方根'],
        ['math.tan', '(${1:value})', '正切函数'],
        ['max', '(${1:value1},${2:value2},${3:value3})', '返回参数列表中的最大值，比较规则遵循aviator规则。'],
        ['min', '(${1:value1},${2:value2},${3:value3})', '返回参数列表中的最小值，比较规则遵循aviator规则。'],
        ['now', '()', '返回 System.currentTimeMillis'],
        ['print', '(${1:object})', '打印对象,如果指定 out,向 out 打印, 否则输出到控制台'],
        ['rand', '()', '返回一个介于 0-1 的随机数,double 类型'],
        ['rand', '(${1:num})', '返回一个介于 0- num 的随机数,long 类型'],
        ['reduce', '(${1:seq},${2:func},${3:initvalue})', 'fun 接收两个参数,第一个是集合元素, 第二个是累积的函数,本函数用于将 fun 作用在结果值（初始值为 init 指定)和集合的每个元素上面，返回新的结果值；函数返回最终的结果值'],
        ['seq.add', '(${1:collect},${2:element})', '往集合collect添加元素，集合可以是 java.util.Collection，也可以是 java.util.Map（三参数版本）'],
        ['seq.and', '(${1:func1},${2:func2},${3:func3})', '根据多个函数的判断结果，返回一个新的组合。 当所有函数的结果都返回true的时候，返回对象到新的组合。'],
        ['seq.eq', '(${1:value})', '通常与filter组合使用 \n判断对象是否跟value相等,相等返回true'],
        ['seq.every', '(${1:seq},${2:func})', 'fun 接收集合的每个元素作为唯一参数，返回 true 或 false。当集合里的每个元素调用 fun 后都返回 true 的时候，整个调用结果为 true，否则为 false。'],
        ['seq.exists', '()', '通常与filter组合使用 \n判断对象是否为null值，是null返回true，反之返回false'],
        ['seq.ge', '(${1:value})', '通常与filter组合使用 \n判断对象是否大于等于value,大于等于返回true'],
        ['seq.get', '(${1:collect},${2:element})', '从 list、数组或者 hash-map 获取对应的元素值，对于 list 和数组， element 为元素的索引位置（从 0 开始），对于 hash map 来说， element 为 key。'],
        ['seq.gt', '(${1:value})', '通常与filter组合使用 \n判断对象是否大于value,大于返回true'],
        ['seq.le', '(${1:value})', '通常与filter组合使用 \n 判断对象是否小于等于value,小于等于返回true'],
        ['seq.list', '(${1:param1},${2:param2},${3:param3})', '创建一个 java.util.ArrayList 实例，添加参数到这个集合并返回。'],
        ['seq.lt', '(${1:value})', '通常与filter组合使用 \n 判断对象是否小于value,小于返回true'],
        ['seq.map', '', '创建一个 java.util.HashMap 实例，参数要求偶数个，类似 k1,v1 这样成对作为 key-value 存入 map，返回集合。'],
        ['seq.max', '(${1:collect})', '返回集合中的最大元素，要求集合元素可比较（实现 Comprable 接口），比较规则遵循 aviator 规则。'],
        ['seq.min', '(${1:collect})', '返回集合中的最小元素，要求集合元素可比较（实现 Comprable 接口），比较规则遵循 aviator 规则。'],
        ['seq.neq', '(${1:value})', '通常与filter组合使用 \n判断对象是否跟value不等,不等返回true'],
        ['seq.nil', '()', '通常与filter组合使用 \n 判断对象是否为null值，是null返回true'],
        ['seq.not_any', '(${1:seq},${2:func})', 'fun 接收集合的每个元素作为唯一参数，返回 true 或 false。当集合里的每个元素调用 fun 后都返回 false 的时候，整个调用结果为 true，否则为 false。'],
        ['seq.or', '(${1:func1},${2:func2},${3:func3})', '根据多个函数的判断结果，返回一个新的组合。 当任一函数的结果都返回true的时候，返回对象到新的组合。'],
        ['seq.remove', '(${1:collect},${2:element})', '从集合或者hash map中删除目标元素或者key的第一个'],
        ['seq.set', '(${1:param1},${2:param2},${3:param3})', '创建一个 java.util.HashSet 实例，添加参数到这个集合并返回。'],
        ['seq.some', '(${1:seq},${2:func})', 'fun接收集合的每个元素作为唯一参数，返回第一个结果为true的元素。'],
        ['sort', '(${1:seq})', '排序集合,仅对数组和List有效,返回排序后的新集合'],





        ['str', '()', '将对象转换成字符串格式'],
        ['string.contains', '(${1:string1},${2:string2})', '判断 string1 是否包含string2,返回 Boolean \n区别大小写'],
        ['string.endsWith', '(${1:string1},${2:string2})', 'string1 是否以 string2 结尾,返回 Boolean \n区别大小写'],
        ['string.indexOf', '(${1:string1},${2:string2})', '求s2在s1中的起始索引位置,如果不存在为-1'],
        ['string.join', '(${1:seq},${2:seperator})', '将集合seq里的元素以seperator为间隔 连接起来形成字符串'],
        ['string.length', '(${1:string})', '求字符串长度,返回 Long'],
        ['string.lower', '(${1:string})', '将字符串转换成小写'],
        ['string.md5', '(${1:string})', '将字符串md5加密'],
        ['string.pinyin', '(${1:string},${2:num})', '获取字符串的拼音，num=0时获取不带音标的完整拼音，num=1时获取首字母拼音，num=2时获取带音标的完整拼音'],
        ['string.replace_all', '(${1:seq},${2:regex},${3:replacement})', '用replacement替换str里面的所有regex'],
        ['string.replace_first', '(${1:string},${2:regex},${3:replacement})', '用replacement替换str里面的第一个regex'],
        ['string.startsWith', '(${1:string1},${2:string2})', 'string1 是否以 string2 开始,返回 Boolean \n区别大小写'],
        ['string.substring', '(${1:string},${2:begin},${3:end})', '截取字符串string,从 begin到end;如果忽略end的话,将从begin到结尾。 \n begin为负数就是right截取'],
        ['string.substring_between', '(${1:string},${2:startStr},${3:endStr})', '截取字符串'],
        ['string.substring_before', '(${1:string})', '向前截取字符串'],
        ['string.substring_after', '(${1:string})', '向后截取字符串'],



        ['string.bytelength', '(${1:source},${2:code})', '字节型长度'],
        ['string.bytesubstring', '(${1:source},${2:startindex},${3:endindex},${4:code})', '截取字节型长度'],
        ['string.byteindexof', '(${1:source},${2:string},${3:code})', '查找字节'],
        ['string.suuid', '()', '获取定长为num位的随机字符串'],
        ['string.trim', '(${1:string})', '去掉字符串两端的多余的空格'],
        ['string.upper', '(${1:string})', '将字符串转换成大写'],
        ['string.url.decode', '(${1:string})', 'url解码'],
        ['string.url.encode', '(${1:string})', 'url编码'],
        ['string.uuid', '()', '获取随机字符串'],
        ['string.suid', '(${1:long})'],
        ['string_to_date', '(${1:source},${2:format})', '将特定格式的字符串转化为 Date对象'],
        ['string.reverse', '()', '颠倒字符串顺序'],
        ['string.replace', '(${1:string},${2:targetstr},${3:replaceStr})', '字符串替换'],
        ['string.replace_each', '(${1:string},${2:targetArray},${3:replaceArray})', '多个字符串替换'],
        ['string.repeat', '(${1:string},${2:num})', '字符串重复多次'],
        ['string.split', '(${1:string})', '分割字符串'],
        ['string.split_by_regex', '(${1:string},${2:regex})', '分割字符串(正则)'],
        ['string.split_by_chars', '(${1:string},${2:chars})', '分割字符串(字符)'],
        ['string.split_by_separator', '(${1:string},${2:separator})', '分割字符串(规则)'],
        ['string.leftPad', '(${1:str},${2:size},${2:pad})'],
        ['string.rightPad', '(${1:str},${2:size},${2:pad})'],
        ['string.center', '(${1:str},${2:size},${2:pad})'],


        ['strutl.repeat', '(${1:string},${2:num})', '字符串重复多次'],
        ['strutl.replace', '(${1:string},${2:targetstr},${3:replaceStr})', '字符串替换'],
        ['strutl.replaceEach', '(${1:string},${2:targetArray},${3:replaceArray})', '多个字符串替换'],
        ['strutl.split', '(${1:string},${2:separator})', '分割字符串'],
        ['strutl.substringBetween', '(${1:string},${2:startStr},${3:endStr})', '截取字符串'],
        ['strutl.substringBetweenInclude', '(${1:string},${2:startStr},${3:endStr})', '截取字符串（包括首尾字符）'],
        ['sysdate', '()', '返回当前日期对象 java.util.Date'],
        ['task.session.attribute', '', '{set:"bool","=":"task.session.attribute($const.THEMEID,user.theme)"},\n将值写到session中。'],
        ['task.session.invalidate', '', '\n把session干掉。'],
        ['task.session.timeout', '', '{set:""bool"",""="":""task.session.timeout(user.timeout)""},\ntimeout是session的超时设置。'],

        ['jump.continue', '{jump:"continue"}', '跳出本次循环并继续'],
        ['jump.break', '{jump:"break"}', '跳出本次循环并终止']
      ];
      functions.forEach((func) => {
        suggestions.push({
          label: func[0],
          kind: (window as any).monaco.languages.CompletionItemKind.Function,
          insertText: [func[0] + func[1]].join('\n'),
          insertTextRules: (window as any).monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: func[2]
        });
      });

      const codeStr = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1
      });
      let codeSnipits = codeStr.match(/([\w_]+)/g) || [];
      codeSnipits = Array.from(new Set(codeSnipits)); // 去重
      for (const item of codeSnipits) {
        suggestions.push({
          label: item,
          kind: (window as any).monaco.languages.CompletionItemKind.Text,
          insertText: item,
          insertTextRules: null,
          documentation: item
        });
      }
      return { suggestions };
    }
  });

  const bracketConfig = {
    surroundingPairs: [{ open: '{', close: '}' }, { open: '[', close: ']' }],
    autoClosingPairs: [{ open: '{', close: '}' }, { open: '[', close: ']' }],
    brackets: [['{', '}'], ['[', ']']]
  };
  (window as any).monaco.languages.setLanguageConfiguration('qscript', bracketConfig);

  (window as any).monaco.editor.defineTheme('qscript-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'custom-info', foreground: '808080' },
      { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
      { token: 'custom-notice', foreground: 'FFA500' },
      { token: 'custom-date', foreground: '008800' },
    ],
    colors: {
      'editor.background': '#3b3b3b',
      'editorLineNumber.foreground': '#ffffff',
      'editor.lineHighlightBackground': '#3b3b3b',
    }
  });


  (window as any).monaco.editor.defineTheme('vs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment.qscript', foreground: '79af60' }

    ],
    colors: {
      //       // A list of color names:
      // 'foreground' // Overall foreground color. This color is only used if not overridden by a component.
      // 'errorForeground' // Overall foreground color for error messages. This color is only used if not overridden by a component.
      // 'descriptionForeground' // Foreground color for description text providing additional information, for example for a label.
      // 'focusBorder' // Overall border color for focused elements. This color is only used if not overridden by a component.
      // 'contrastBorder' // An extra border around elements to separate them from others for greater contrast.
      // 'contrastActiveBorder' // An extra border around active elements to separate them from others for greater contrast.
      // 'selection.background' // The background color of text selections in the workbench (e.g. for input fields or text areas). Note that this does not apply to selections within the editor.
      // 'textSeparator.foreground' // Color for text separators.
      // 'textLink.foreground' // Foreground color for links in text.
      // 'textLink.activeForeground' // Foreground color for active links in text.
      // 'textPreformat.foreground' // Foreground color for preformatted text segments.
      // 'textBlockQuote.background' // Background color for block quotes in text.
      // 'textBlockQuote.border' // Border color for block quotes in text.
      // 'textCodeBlock.background' // Background color for code blocks in text.
      // 'widget.shadow' // Shadow color of widgets such as find/replace inside the editor.
      // 'input.background' // Input box background.
      // 'input.foreground' // Input box foreground.
      // 'input.border' // Input box border.
      // 'inputOption.activeBorder' // Border color of activated options in input fields.
      // 'input.placeholderForeground' // Input box foreground color for placeholder text.
      // 'inputValidation.infoBackground' // Input validation background color for information severity.
      // 'inputValidation.infoBorder' // Input validation border color for information severity.
      // 'inputValidation.warningBackground' // Input validation background color for information warning.
      // 'inputValidation.warningBorder' // Input validation border color for warning severity.
      // 'inputValidation.errorBackground' // Input validation background color for error severity.
      // 'inputValidation.errorBorder' // Input validation border color for error severity.
      // 'dropdown.background' // Dropdown background.
      // 'dropdown.foreground' // Dropdown foreground.
      // 'dropdown.border' // Dropdown border.
      // 'list.focusBackground' // List/Tree background color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
      // 'list.focusForeground' // List/Tree foreground color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
      // 'list.activeSelectionBackground' // List/Tree background color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
      // 'list.activeSelectionForeground' // List/Tree foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
      // 'list.inactiveSelectionBackground' // List/Tree background color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.
      // 'list.inactiveSelectionForeground' // List/Tree foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.
      // 'list.hoverBackground' // List/Tree background when hovering over items using the mouse.
      // 'list.hoverForeground' // List/Tree foreground when hovering over items using the mouse.
      // 'list.dropBackground' // List/Tree drag and drop background when moving items around using the mouse.
      // 'list.highlightForeground' // List/Tree foreground color of the match highlights when searching inside the list/tree.
      // 'pickerGroup.foreground' // Quick picker color for grouping labels.
      // 'pickerGroup.border' // Quick picker color for grouping borders.
      // 'button.foreground' // Button foreground color.
      // 'button.background' // Button background color.
      // 'button.hoverBackground' // Button background color when hovering.
      // 'badge.background' // Badge background color. Badges are small information labels, e.g. for search results count.
      // 'badge.foreground' // Badge foreground color. Badges are small information labels, e.g. for search results count.
      // 'scrollbar.shadow' // Scrollbar shadow to indicate that the view is scrolled.
      // 'scrollbarSlider.background' // Slider background color.
      // 'scrollbarSlider.hoverBackground' // Slider background color when hovering.
      // 'scrollbarSlider.activeBackground' // Slider background color when active.
      // 'progressBar.background' // Background color of the progress bar that can show for long running operations.
      // 'editor.background' // Editor background color.
      // 'editor.foreground' // Editor default foreground color.
      // 'editorWidget.background' // Background color of editor widgets, such as find/replace.
      // 'editorWidget.border' // Border color of editor widgets. The color is only used if the widget chooses to have a border and if the color is not overridden by a widget.
      // 'editor.selectionBackground' // Color of the editor selection.
      // 'editor.selectionForeground' // Color of the selected text for high contrast.
      // 'editor.inactiveSelectionBackground' // Color of the selection in an inactive editor.
      // 'editor.selectionHighlightBackground' // Color for regions with the same content as the selection.
      // 'editor.findMatchBackground' // Color of the current search match.
      // 'editor.findMatchHighlightBackground' // Color of the other search matches.
      // 'editor.findRangeHighlightBackground' // Color the range limiting the search.
      // 'editor.hoverHighlightBackground' // Highlight below the word for which a hover is shown.
      // 'editorHoverWidget.background' // Background color of the editor hover.
      // 'editorHoverWidget.border' // Border color of the editor hover.
      // 'editorLink.activeForeground' // Color of active links.
      // 'diffEditor.insertedTextBackground' // Background color for text that got inserted.
      // 'diffEditor.removedTextBackground' // Background color for text that got removed.
      // 'diffEditor.insertedTextBorder' // Outline color for the text that got inserted.
      // 'diffEditor.removedTextBorder' // Outline color for text that got removed.
      // 'editorOverviewRuler.currentContentForeground' // Current overview ruler foreground for inline merge-conflicts.
      // 'editorOverviewRuler.incomingContentForeground' // Incoming overview ruler foreground for inline merge-conflicts.
      // 'editorOverviewRuler.commonContentForeground' // Common ancestor overview ruler foreground for inline merge-conflicts.
      // 'editor.lineHighlightBackground' // Background color for the highlight of line at the cursor position.
      // 'editor.lineHighlightBorder' // Background color for the border around the line at the cursor position.
      // 'editor.rangeHighlightBackground' // Background color of highlighted ranges, like by quick open and find features.
      // 'editorCursor.foreground' // Color of the editor cursor.
      // 'editorWhitespace.foreground' // Color of whitespace characters in the editor.
      // 'editorIndentGuide.background' // Color of the editor indentation guides.
      // 'editorLineNumber.foreground' // Color of editor line numbers.
      // 'editorRuler.foreground' // Color of the editor rulers.
      // 'editorCodeLens.foreground' // Foreground color of editor code lenses
      // 'editorBracketMatch.background' // Background color behind matching brackets
      // 'editorBracketMatch.border' // Color for matching brackets boxes
      // 'editorOverviewRuler.border' // Color of the overview ruler border.
      // 'editorGutter.background' // Background color of the editor gutter. The gutter contains the glyph margins and the line numbers.
      // 'editorError.foreground' // Foreground color of error squigglies in the editor.
      // 'editorError.border' // Border color of error squigglies in the editor.
      // 'editorWarning.foreground' // Foreground color of warning squigglies in the editor.
      // 'editorWarning.border' // Border color of warning squigglies in the editor.
      // 'editorMarkerNavigationError.background' // Editor marker navigation widget error color.
      // 'editorMarkerNavigationWarning.background' // Editor marker navigation widget warning color.
      // 'editorMarkerNavigation.background' // Editor marker navigation widget background.
      // 'editorSuggestWidget.background' // Background color of the suggest widget.
      // 'editorSuggestWidget.border' // Border color of the suggest widget.
      // 'editorSuggestWidget.foreground' // Foreground color of the suggest widget.
      // 'editorSuggestWidget.selectedBackground' // Background color of the selected entry in the suggest widget.
      // 'editorSuggestWidget.highlightForeground' // Color of the match highlights in the suggest widget.
      // 'editor.wordHighlightBackground' // Background color of a symbol during read-access, like reading a variable.
      // 'editor.wordHighlightStrongBackground' // Background color of a symbol during write-access, like writing to a variable.
      // 'peekViewTitle.background' // Background color of the peek view title area.
      // 'peekViewTitleLabel.foreground' // Color of the peek view title.
      // 'peekViewTitleDescription.foreground' // Color of the peek view title info.
      // 'peekView.border' // Color of the peek view borders and arrow.
      // 'peekViewResult.background' // Background color of the peek view result list.
      // 'peekViewResult.lineForeground' // Foreground color for line nodes in the peek view result list.
      // 'peekViewResult.fileForeground' // Foreground color for file nodes in the peek view result list.
      // 'peekViewResult.selectionBackground' // Background color of the selected entry in the peek view result list.
      // 'peekViewResult.selectionForeground' // Foreground color of the selected entry in the peek view result list.
      // 'peekViewEditor.background' // Background color of the peek view editor.
      // 'peekViewEditorGutter.background' // Background color of the gutter in the peek view editor.
      // 'peekViewResult.matchHighlightBackground' // Match highlight color in the peek view result list.
      // 'peekViewEditor.matchHighlightBackground' // Match highlight color in the peek view editor.
    }
  });
  // for javascript
  //   const fact = `declare namespace my {
  // export function cid(id: string): Container;
  // export function call(): string;
  // }`;
  //   const factFilename = 'myCustomNamespace';
  //   (window as any).monaco.languages.typescript.javascriptDefaults.addExtraLib(fact, factFilename);

}
