function def_prototype() {
    return {
        category() {
            return document.getElementById('category_def_prototype').innerHTML
        },
        syllable() {
            return document.getElementById('syllable_def_prototype').innerHTML
        }
    };
}


function filter_list(l, f) {
    let res = [];
    for (let i in l) {
        if (f(l[i])) {
            res.push(l[i]);
        }
    }
    return res;
}

function list_eq(l1, l2) {
    if (l1.length != l2.length) {
        return false;
    }
    for (let i in l1) {
        let a = l1[i];
        let b = l2[i];
        if (a !== b) {
            return false;
        }
    }
    return true;
}

function list_includes_list(l1, l2) {
    for (let i in l1) {
        let e = l1[i];
        if (typeof e !== "object") {
            continue;
        }
        if (list_eq(e, l2)) {
            return true;
        }
    }
    return false;
}

function remove_double_lists_in_list(l) {
    let res = [];
    for (let i in l) {
        let e = l[i];
        if (!list_includes_list(res, e)) {
            res.push(e);
        }
    }
    return res;
}

class QuestionMarkResolver {
    resolve_first_question_mark(str_list) {
        let a = [];
        let b = [];
        for (let i in str_list) {
            i = parseInt(i);
            let s = str_list[i];
            if (s.endsWith('?')) {
                let pre = str_list.slice(0, i);
                let end = str_list.slice(i + 1);
                // remove the ?
                let item = s.substring(0, s.length - 1);
                a = pre.concat(item, end);
                b = pre.concat(end);
                return [a, b];
            }
        }
        return [str_list];
    }

    list_has_optionals(str_list) {
        let r = this.resolve_first_question_mark(str_list);
        return r.length == 2;
    }

    resolve_every_question_mark(str_list) {
        let res = [str_list];
        let has_optionals = true;
        let stop = 0;
        while (has_optionals) {
            let new_res = [];
            has_optionals = false;
            for (let i in res) {
                let list = res[i];
                let temp = this.resolve_first_question_mark(list);
                new_res.push(temp[0]);
                if (temp.length == 2) {
                    new_res.push(temp[1]);
                    has_optionals = true;
                }
            }
            res = new_res;
        }
        return remove_double_lists_in_list(res);
    }

    resolve_every_question_mark_multiple(str_list_list) {
        let res = [];
        for (let i in str_list_list) {
            let str_list = str_list_list[i];
            res = res.concat(this.resolve_every_question_mark(str_list));
        }
        return remove_double_lists_in_list(res);
    }
}


class UIv3 {
    constructor() {
        this.prot = def_prototype();
        this.filters = {
            letter: (x) => x.tagName == "INPUT" && x.name != "cat",
            div: (x) => x.tagName == "DIV",
            syllable_cat: (x) => x.tagName == "INPUT",
            sylcount: (x) => x.className !== undefined && x.className.includes('sylcount-item') && x.children[0].name !== "first"
        };
        this.f_onclick_on_sylcount = (curr) => curr.children[0];
        this.qm = new QuestionMarkResolver();
    }

    enter_remove_mode(btn, filter_f, anim_class, f_onclick_on_what) {
        let par = btn.parentNode;
        let all = filter_list(par.children, filter_f);
        if (all.length === 0) {
            return all;
        }
        for (let i in all) {
            let curr = all[i];
            if (f_onclick_on_what !== undefined) {
                curr = f_onclick_on_what(curr);
            }
            curr.classList.add(anim_class);
            curr.onclick = () => {
                ui.exit_remove_mode(all[i], btn, filter_f, anim_class, f_onclick_on_what);
            };
        }
        btn.onclick = () => {
            return ui.exit_remove_mode(btn, btn, filter_f, anim_class, f_onclick_on_what);
        }
        btn.innerHTML = "x";
        return all;
    }

    exit_remove_mode(elt, btn, filter_f, anim_class, f_onclick_on_what) {
        let par = elt.parentNode;
        if (elt !== btn) {
            // Remove it if it's not the button (I don't want to remove the button)
            par.removeChild(elt);
        }
        btn.onclick = () => {
            return ui.enter_remove_mode(btn, filter_f, anim_class, f_onclick_on_what);
        }
        btn.innerHTML = "-";

        let all = filter_list(par.children, filter_f);
        for (let i in all) {
            let curr = all[i];
            if (f_onclick_on_what !== undefined) {
                curr = f_onclick_on_what(curr);
            }
            curr.classList.remove(anim_class);
            curr.onclick = undefined;
        }
        return elt;
    }

    remove_last(btn, filter_f) {
        let par = btn.parentNode;
        let all = filter_list(par.children, filter_f);
        let last = all[all.length - 1];

        if (all.length != 0) {
            par.removeChild(last);
        }

        return last;
    }

    add_letter_input(btn) {
        let div = btn.parentNode;
        let input_elt = document.createElement('input');
        input_elt.type = "string";
        input_elt.size = "2";
        input_elt.classList.add('letter');
        div.insertBefore(input_elt, btn);
        return input_elt;
    }

    add_category(btn) {
        let div = btn.parentNode;
        let categ_elt = document.createElement('div');
        categ_elt.classList.add('category_def');

        categ_elt.innerHTML = this.prot.category();

        div.insertBefore(categ_elt, btn);
        return categ_elt;
    }

    add_syllable_cat(btn) {
        let div = btn.parentNode;
        let input_elt = document.createElement('input');
        input_elt.type = "string";
        input_elt.size = "4";
        input_elt.classList.add('syllable_cat');
        div.insertBefore(input_elt, btn);
        return input_elt;
    }

    add_syllable(btn) {
        let div = btn.parentNode;
        let syl_elt = document.createElement('div');
        syl_elt.classList.add('syllable_def');

        syl_elt.innerHTML = this.prot.syllable();

        div.insertBefore(syl_elt, btn);
        return syl_elt;
    }

    add_sylcount(btn) {
        let div = btn.parentNode;

        let sylcount_elt = document.createElement('input');
        sylcount_elt.type = "number";
        sylcount_elt.size = "4";
        sylcount_elt.classList.add('sylcount');
        sylcount_elt.min = "1";
        sylcount_elt.step = "1";
        sylcount_elt.value = "1";

        let br = document.createElement('br');
        let txt = document.createTextNode('or ');

        let parent_div = document.createElement('div');
        parent_div.classList.add('sylcount-item');

        let is_first = document.getElementsByClassName('sylcount-item').length == 0;

        if (is_first) {
            sylcount_elt.name = "first";
        } else {
            parent_div.appendChild(txt);
        }
        parent_div.appendChild(sylcount_elt);
        parent_div.appendChild(br);

        div.insertBefore(parent_div, btn);
        return sylcount_elt;
    }

    clear_categories() {
        let c = document.getElementById('categories');
        while (document.getElementsByClassName('category_def').length !== 0) {
            c.removeChild(c.children[0]);
        }
    }

    clear_syllables() {
        let s = document.getElementById('syllables');
        while (document.getElementsByClassName('syllable_def').length !== 0) {
            s.removeChild(s.children[0]);
        }
    }

    clear_sylcounts() {
        let sc = document.getElementById('sylcount');
        while (document.getElementsByClassName('sylcount-item').length > 1) {
            sc.removeChild(sc.children[1]);
        }
    }

    clear_all() {
        this.clear_categories();
        this.clear_syllables();
        this.clear_sylcounts();

        document.getElementById('rem_dbls').checked = false;
        document.getElementById('amount').value = 1;
    }

    custom_escape(s) {
        return s.replace(/@/g, '@0')
            .replace(/=/g, '@1')
            .replace(/\//g, '@2')
            .replace(/;/g, '@3')
            .replace(/::/g, '@4');
    }

    custom_unescape(s) {
        return s.replace(/@4/g, '::')
            .replace(/@3/g, ';')
            .replace(/@2/g, '/')
            .replace(/@1/g, '=')
            .replace(/@0/g, '@');
    }

    get categories() {
        let ct = document.getElementById('categories');

        let categs = {};
        let temp_key = "";
        let temp_letters = [];
        for (let i in ct.children) {
            let categ = ct.children[i];
            for (let j in categ.children) {
                let child = categ.children[j];
                if (child.tagName !== 'INPUT') {
                    continue;
                }
                let val = child.value;
                if (child.name === 'cat') {
                    if (temp_key !== "") {
                        categs[temp_key] = temp_letters;
                    }
                    temp_letters = [];
                    temp_key = val;
                } else {
                    temp_letters.push(val);
                }
            }
        }
        if (temp_key !== "") {
            categs[temp_key] = temp_letters;
        }
        return categs
    }

    set categories(cats_obj) {
        this.clear_categories();
        let c = document.getElementById('categories');
        let add_button = c.children[0];
        for (let key in cats_obj) {
            let categ_div = add_button.onclick();
            let categ_name_field = categ_div.children[0];
            let letter_add_btn = categ_div.children[1];
            categ_name_field.value = key;
            for (let j in cats_obj[key]) {
                let letter = cats_obj[key][j];
                let letter_field = letter_add_btn.onclick();
                letter_field.value = letter;
            }
        }
    }

    get syllables() {
        let sl = document.getElementById('syllables');

        let syls = [];
        let temp_cats = [];
        for (let i in sl.children) {
            let syl = sl.children[i];
            if (syl.tagName !== 'DIV') {
                continue;
            }
            for (let j in syl.children) {
                let child = syl.children[j];
                if (child.tagName !== 'INPUT') {
                    continue;
                }
                let val = child.value;
                temp_cats.push(val);
            }
            syls.push(temp_cats);
            temp_cats = [];
        }
        console.log(syls);
        return this.qm.resolve_every_question_mark_multiple(syls);
    }

    set syllables(syls_list) {
        this.clear_syllables();
        let s = document.getElementById('syllables');
        let add_button = s.children[0];
        for (let i in syls_list) {
            let categs = syls_list[i];
            let syl_div = add_button.onclick();
            let syl_add_btn = syl_div.children[1];
            for (let j in categs) {
                let categ = categs[j];
                let categ_field;
                if (j == 0) {
                    categ_field = syl_div.children[0];
                } else {
                    categ_field = syl_add_btn.onclick();
                }
                categ_field.value = categ;
            }
        }
    }

    get syllable_counts_list() {
        let sc = document.getElementById('sylcount');

        let syl_counts = [];
        for (let i in sc.children) {
            let child = sc.children[i];
            if (child.tagName !== "DIV") {
                continue;
            }
            let elt = child.children[0];
            let val = elt.value;
            if (!syl_counts.includes(val)) {
                syl_counts.push(val);
            }
        }
        return syl_counts;
    }

    set syllable_counts_list(sylcounts_list) {
        this.clear_sylcounts();
        let sc = document.getElementById('sylcount');
        let add_button = sc.children[0];
        for (let i in sylcounts_list) {
            let sylcount = sylcounts_list[i];
            let sylcount_field = add_button.onclick();
            sylcount_field.value = sylcount;
        }
    }

    get timeout() {
        return document.getElementById('timeout').value;
    }

    set timeout(v) {
        document.getElementById('timeout').value = v;
    }

    get remove_doubles() {
        // The + converts it to an int
        return +document.getElementById('rem_dbls').checked;
    }

    set remove_doubles(v) {
        document.getElementById('rem_dbls').checked = v;
    }

    get amount() {
        return document.getElementById('amount').value;
    }

    set amount(v) {
        document.getElementById('amount').value = v;
    }

    to_string() {
        let ct = document.getElementById('categories');
        let sl = document.getElementById('syllables');
        let sc = document.getElementById('sylcount');

        let remove_doubles = this.remove_doubles;
        let amount = this.amount;


        let categs = this.categories;
        let categ_str = "";
        for (let key in categs) {
            let cat_name = this.custom_escape(key);
            let cat_list = categs[key];
            let new_cat_list = [];
            for (let i in cat_list) {
                let v = this.custom_escape(cat_list[i]);
                new_cat_list.push(v);
            }
            categ_str += ';' + cat_name + '=' + new_cat_list.join('/');
        }
        categ_str = categ_str.substring(1);

        let syls = this.syllables;
        let syl_str = "";
        for (let i in syls) {
            let syl_list = syls[i];
            let new_syl_list = [];
            for (let j in syl_list) {
                let v = this.custom_escape(syl_list[j]);
                new_syl_list.push(v);
            }
            syl_str += ';' + new_syl_list.join('/');
        }
        syl_str = syl_str.substring(1);


        let syl_count_str = this.syllable_counts_list.join('/');


        let res_list = [categ_str, syl_str, remove_doubles, amount, syl_count_str];
        return res_list.join('::');
    }

    from_string(s) {
        let vals_temp = s.split('::');
        let categ_str = vals_temp[0];
        let syl_str = vals_temp[1];
        let remove_doubles = parseInt(vals_temp[2]);
        let amount = parseInt(vals_temp[3]);
        let syl_count_str = vals_temp[4];

        this.remove_doubles = remove_doubles;
        this.amount = amount;

        let categs = {};
        let categ_strs = categ_str.split(';');
        for (let i in categ_strs) {
            let categ_s = categ_strs[i];
            let categ_temp = categ_s.split('=');
            let categ_name = this.custom_unescape(categ_temp[0]);
            let categ_items = categ_temp[1].split('/');
            categ_items.forEach((elt, i, arr) => {
                arr[i] = this.custom_unescape(elt)
            });
            categs[categ_name] = categ_items;
        }
        this.categories = categs;

        let syls = [];
        let syl_strs = syl_str.split(';');
        for (let i in syl_strs) {
            let syl_s = syl_strs[i];
            let syl_items = syl_s.split('/');
            syl_items.forEach((elt, i, arr) => {
                arr[i] = this.custom_unescape(elt)
            });
            syls.push(syl_items);
        }
        this.syllables = syls;

        let syl_counts = syl_count_str.split('/');
        this.syllable_counts_list = syl_counts;
    }
}