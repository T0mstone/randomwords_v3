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